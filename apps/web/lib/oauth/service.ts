import { createApiKey } from "@ux-kb/core";
import { getPrisma } from "../db";
import { getStore } from "../store";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  AUTHORIZATION_CODE_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "./config";
import { hashToken, randomToken, TOKEN_PREFIXES } from "./tokens";

export type ClientAuthMethod = "none" | "client_secret_post" | "client_secret_basic";

export interface RegisterClientInput {
  name: string;
  redirectUris: string[];
  grantTypes: string[];
  responseTypes: string[];
  scopes: string[];
  tokenEndpointAuthMethod: ClientAuthMethod;
  createdByIp: string | null;
}

export interface RegisteredClient {
  id: string;
  clientId: string;
  name: string;
  redirectUris: string[];
  scopes: string[];
  tokenEndpointAuthMethod: string;
  /** Plaintext secret, returned once. Null for public clients. */
  clientSecret: string | null;
}

/** RFC 7591 dynamic client registration. */
export async function registerClient(input: RegisterClientInput): Promise<RegisteredClient> {
  const prisma = getPrisma();
  const clientId = randomToken(TOKEN_PREFIXES.client, 16);
  const clientSecret =
    input.tokenEndpointAuthMethod === "none"
      ? null
      : randomToken(TOKEN_PREFIXES.clientSecret, 32);

  const row = await prisma.oAuthClient.create({
    data: {
      clientId,
      clientSecretHash: clientSecret ? hashToken(clientSecret) : null,
      name: input.name,
      redirectUris: input.redirectUris,
      grantTypes: input.grantTypes,
      responseTypes: input.responseTypes,
      scopes: input.scopes,
      tokenEndpointAuthMethod: input.tokenEndpointAuthMethod,
      createdByIp: input.createdByIp,
    },
  });

  return {
    id: row.id,
    clientId: row.clientId,
    name: row.name,
    redirectUris: row.redirectUris,
    scopes: row.scopes,
    tokenEndpointAuthMethod: row.tokenEndpointAuthMethod,
    clientSecret,
  };
}

export async function findClient(clientId: string) {
  return getPrisma().oAuthClient.findUnique({ where: { clientId } });
}

export async function touchClient(clientId: string): Promise<void> {
  await getPrisma().oAuthClient.update({
    where: { clientId },
    data: { lastUsedAt: new Date() },
  });
}

export interface AuthorizationCodeInput {
  clientId: string;
  userId: string;
  redirectUri: string;
  scopes: string[];
  codeChallenge: string;
  resource: string | null;
}

/** Mint a one-time authorization code. Only its hash is persisted. */
export async function issueAuthorizationCode(input: AuthorizationCodeInput): Promise<string> {
  const code = randomToken(TOKEN_PREFIXES.code, 32);
  await getPrisma().oAuthAuthorizationCode.create({
    data: {
      codeHash: hashToken(code),
      clientId: input.clientId,
      userId: input.userId,
      redirectUri: input.redirectUri,
      scopes: input.scopes,
      codeChallenge: input.codeChallenge,
      codeChallengeMethod: "S256",
      resource: input.resource,
      expiresAt: new Date(Date.now() + AUTHORIZATION_CODE_TTL_SECONDS * 1000),
    },
  });
  return code;
}

/**
 * Atomically claim a code. Returns the row only to the request that marked it
 * used, so a replayed code can never mint a second token pair.
 */
export async function takeAuthorizationCode(code: string) {
  const prisma = getPrisma();
  const codeHash = hashToken(code);
  const row = await prisma.oAuthAuthorizationCode.findUnique({ where: { codeHash } });
  if (!row) return null;
  if (row.usedAt || row.expiresAt.getTime() <= Date.now()) return null;

  const claimed = await prisma.oAuthAuthorizationCode.updateMany({
    where: { id: row.id, usedAt: null },
    data: { usedAt: new Date() },
  });
  return claimed.count === 1 ? row : null;
}

export class GrantError extends Error {
  constructor(
    readonly code: "account_unavailable" | "key_unavailable",
    message: string,
  ) {
    super(message);
  }
}

function apiKeyName(clientName: string, clientId: string): string {
  const suffix = ` (${clientId.slice(-6)})`;
  const base = `OAuth · ${clientName}`;
  const maxBase = 64 - suffix.length;
  return `${base.length > maxBase ? base.slice(0, maxBase) : base}${suffix}`;
}

/**
 * Each client/user pair owns exactly one hidden API key. Reusing it keeps
 * sessions, usage history, and per-key rate limits coherent; bypassing the
 * key limit stops OAuth grants from consuming the user's dashboard quota.
 */
export async function ensureGrant(
  client: { clientId: string; name: string },
  userId: string,
  scopes: string[],
) {
  const prisma = getPrisma();
  const store = await getStore();

  const user = await store.getUser(userId);
  if (!user || user.suspendedAt) {
    throw new GrantError("account_unavailable", "This account is suspended.");
  }

  const existing = await prisma.oAuthGrant.findUnique({
    where: { clientId_userId: { clientId: client.clientId, userId } },
    include: { apiKey: true },
  });

  const keyUsable =
    existing?.apiKey &&
    !existing.apiKey.revokedAt &&
    (!existing.apiKey.expiresAt || existing.apiKey.expiresAt.getTime() > Date.now());

  if (existing && !existing.revokedAt && keyUsable) {
    return existing;
  }

  const { record } = await createApiKey(store, {
    name: apiKeyName(client.name, client.clientId),
    ownerId: userId,
    role: user.role,
    scopes: ["mcp:read"],
    bypassKeyLimit: true,
  });

  if (existing) {
    return prisma.oAuthGrant.update({
      where: { id: existing.id },
      data: { apiKeyId: record.id, scopes, revokedAt: null, createdAt: new Date() },
    });
  }

  return prisma.oAuthGrant.create({
    data: { clientId: client.clientId, userId, apiKeyId: record.id, scopes },
  });
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

async function mintPair(input: {
  clientId: string;
  userId: string;
  grantId: string;
  scopes: string[];
}): Promise<TokenPair> {
  const accessToken = randomToken(TOKEN_PREFIXES.access, 32);
  const refreshToken = randomToken(TOKEN_PREFIXES.refresh, 32);
  const now = Date.now();

  await getPrisma().oAuthAccessToken.create({
    data: {
      accessTokenHash: hashToken(accessToken),
      refreshTokenHash: hashToken(refreshToken),
      grantId: input.grantId,
      clientId: input.clientId,
      userId: input.userId,
      scopes: input.scopes,
      expiresAt: new Date(now + ACCESS_TOKEN_TTL_SECONDS * 1000),
      refreshExpiresAt: new Date(now + REFRESH_TOKEN_TTL_SECONDS * 1000),
    },
  });

  return { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_TTL_SECONDS };
}

export function issueTokenPair(input: {
  clientId: string;
  userId: string;
  grantId: string;
  scopes: string[];
}): Promise<TokenPair> {
  return mintPair(input);
}

/**
 * Rotate on every refresh. The conditional update makes concurrent refreshes
 * fail closed instead of both succeeding.
 */
export async function rotateRefreshToken(refreshToken: string) {
  const prisma = getPrisma();
  const refreshTokenHash = hashToken(refreshToken);

  const row = await prisma.oAuthAccessToken.findUnique({
    where: { refreshTokenHash },
    include: { grant: { include: { apiKey: true } }, user: true },
  });

  if (!row || row.revokedAt) return null;
  if (row.refreshExpiresAt.getTime() <= Date.now()) return null;
  if (row.grant.revokedAt) return null;
  if (row.user.suspendedAt) return null;

  const key = row.grant.apiKey;
  if (key.revokedAt) return null;
  if (key.expiresAt && key.expiresAt.getTime() <= Date.now()) return null;

  const accessToken = randomToken(TOKEN_PREFIXES.access, 32);
  const nextRefreshToken = randomToken(TOKEN_PREFIXES.refresh, 32);
  const now = Date.now();

  const updated = await prisma.oAuthAccessToken.updateMany({
    where: { id: row.id, revokedAt: null, refreshTokenHash },
    data: {
      accessTokenHash: hashToken(accessToken),
      refreshTokenHash: hashToken(nextRefreshToken),
      expiresAt: new Date(now + ACCESS_TOKEN_TTL_SECONDS * 1000),
      refreshExpiresAt: new Date(now + REFRESH_TOKEN_TTL_SECONDS * 1000),
    },
  });

  if (updated.count !== 1) return null;

  return {
    clientId: row.clientId,
    accessToken,
    refreshToken: nextRefreshToken,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    scopes: row.scopes,
  };
}

/** Resolve a bearer token to its grant, key, and owning user. */
export async function findAccessToken(accessToken: string) {
  return getPrisma().oAuthAccessToken.findUnique({
    where: { accessTokenHash: hashToken(accessToken) },
    include: { grant: { include: { apiKey: true } }, user: true },
  });
}

export async function touchAccessToken(id: string): Promise<void> {
  await getPrisma().oAuthAccessToken.update({
    where: { id },
    data: { lastUsedAt: new Date() },
  });
}

/** RFC 7009 revocation is idempotent; unknown tokens still return 200. */
export async function revokeToken(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await getPrisma().oAuthAccessToken.updateMany({
    where: {
      OR: [{ accessTokenHash: tokenHash }, { refreshTokenHash: tokenHash }],
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
}

/** Opportunistic cleanup; called from the token endpoint at a low rate. */
export async function pruneOAuthArtifacts(): Promise<void> {
  const prisma = getPrisma();
  const now = Date.now();
  await Promise.all([
    prisma.oAuthAuthorizationCode.deleteMany({
      where: { expiresAt: { lt: new Date(now - 24 * 60 * 60 * 1000) } },
    }),
    prisma.oAuthAccessToken.deleteMany({
      where: {
        refreshExpiresAt: { lt: new Date(now - 30 * 24 * 60 * 60 * 1000) },
        revokedAt: { not: null },
      },
    }),
  ]);
}
