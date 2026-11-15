import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  protectedResourceUrl,
} from "@/lib/oauth/config";
import { oauthError, oauthJson, oauthPreflight } from "@/lib/oauth/http";
import {
  ensureGrant,
  findClient,
  GrantError,
  issueTokenPair,
  pruneOAuthArtifacts,
  rotateRefreshToken,
  takeAuthorizationCode,
  touchClient,
} from "@/lib/oauth/service";
import {
  isValidCodeVerifier,
  verifyClientSecret,
  verifyPkce,
} from "@/lib/oauth/tokens";
import { getLimiter } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
};

async function readParams(request: NextRequest): Promise<URLSearchParams | null> {
  const contentType = (request.headers.get("content-type") ?? "").toLowerCase();
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return new URLSearchParams(await request.text());
  }
  // A few clients send JSON despite the spec; accept it for interoperability.
  if (contentType.includes("application/json")) {
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === "string") params.set(key, value);
      }
      return params;
    } catch {
      return null;
    }
  }
  return null;
}

function parseBasic(header: string | null): { id: string; secret: string } | null {
  if (!header || !header.toLowerCase().startsWith("basic ")) return null;
  try {
    const decoded = Buffer.from(header.slice(6).trim(), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    // RFC 6749 §2.3.1: credentials are form-urlencoded before Base64.
    return {
      id: decodeURIComponent(decoded.slice(0, separator)),
      secret: decodeURIComponent(decoded.slice(separator + 1)),
    };
  } catch {
    return null;
  }
}

function tokenResponse(input: {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  scopes: string[];
}): Response {
  return oauthJson(
    {
      access_token: input.accessToken,
      token_type: "Bearer",
      expires_in: input.expiresIn ?? ACCESS_TOKEN_TTL_SECONDS,
      refresh_token: input.refreshToken,
      scope: input.scopes.join(" "),
    },
    { headers: NO_STORE },
  );
}

export async function POST(request: NextRequest): Promise<Response> {
  const ipHash = hashIp(clientIp(request.headers));
  const ipLimit = await getLimiter().check(
    `oauth-token:${ipHash}`,
    120,
    Date.now(),
    "minute",
  );
  if (!ipLimit.allowed) {
    return oauthError(
      "temporarily_unavailable",
      "Too many token requests from this address. Try again later.",
      429,
      {
        ...NO_STORE,
        "Retry-After": String(Math.max(1, Math.ceil(ipLimit.retryAfterMs / 1000))),
      },
    );
  }

  const params = await readParams(request);
  if (!params) {
    return oauthError(
      "invalid_request",
      "Use Content-Type application/x-www-form-urlencoded.",
      400,
      NO_STORE,
    );
  }

  const basic = parseBasic(request.headers.get("authorization"));
  const clientId = basic?.id ?? params.get("client_id") ?? "";
  if (!clientId) {
    return oauthError("invalid_client", "client_id is required.", 401, {
      ...NO_STORE,
      "WWW-Authenticate": 'Basic realm="ux-kb-oauth"',
    });
  }

  const clientLimit = await getLimiter().check(
    `oauth-token-client:${clientId}`,
    120,
    Date.now(),
    "minute",
  );
  if (!clientLimit.allowed) {
    return oauthError(
      "temporarily_unavailable",
      "Too many token requests for this client. Try again later.",
      429,
      {
        ...NO_STORE,
        "Retry-After": String(Math.max(1, Math.ceil(clientLimit.retryAfterMs / 1000))),
      },
    );
  }

  const client = await findClient(clientId);
  if (!client) {
    return oauthError("invalid_client", "Unknown client_id.", 401, {
      ...NO_STORE,
      "WWW-Authenticate": 'Basic realm="ux-kb-oauth"',
    });
  }

  const presentedSecret = basic?.secret ?? params.get("client_secret") ?? "";
  if (client.tokenEndpointAuthMethod === "none") {
    if (presentedSecret) {
      return oauthError(
        "invalid_client",
        "This client is public and must not send a client_secret.",
        401,
        NO_STORE,
      );
    }
  } else if (
    !presentedSecret ||
    !client.clientSecretHash ||
    !verifyClientSecret(presentedSecret, client.clientSecretHash)
  ) {
    return oauthError("invalid_client", "Client authentication failed.", 401, {
      ...NO_STORE,
      "WWW-Authenticate": 'Basic realm="ux-kb-oauth"',
    });
  }

  const grantType = params.get("grant_type") ?? "";
  if (grantType === "authorization_code") {
    return exchangeCode({ client, params, headers: request.headers });
  }
  if (grantType === "refresh_token") {
    return refreshTokens({ clientId: client.clientId, params });
  }

  return oauthError(
    "unsupported_grant_type",
    "Supported grant types: authorization_code, refresh_token.",
    400,
    NO_STORE,
  );
}

async function exchangeCode(input: {
  client: NonNullable<Awaited<ReturnType<typeof findClient>>>;
  params: URLSearchParams;
  headers: Headers;
}): Promise<Response> {
  const { client, params, headers } = input;
  const code = params.get("code") ?? "";
  const redirectUri = params.get("redirect_uri") ?? "";
  const verifier = params.get("code_verifier") ?? "";
  const resource = params.get("resource");

  if (!code) {
    return oauthError("invalid_request", "code is required.", 400, NO_STORE);
  }
  if (!redirectUri) {
    return oauthError("invalid_request", "redirect_uri is required.", 400, NO_STORE);
  }
  if (!verifier || !isValidCodeVerifier(verifier)) {
    return oauthError(
      "invalid_request",
      "A PKCE code_verifier of 43-128 unreserved characters is required.",
      400,
      NO_STORE,
    );
  }
  if (resource && resource !== protectedResourceUrl(headers)) {
    return oauthError("invalid_target", "Unknown resource indicator.", 400, NO_STORE);
  }

  // Claiming the code burns it even if the remaining checks fail, which makes
  // guessing or replaying a code useless.
  const record = await takeAuthorizationCode(code);
  if (!record) {
    return oauthError(
      "invalid_grant",
      "The authorization code is invalid, expired, or already used.",
      400,
      NO_STORE,
    );
  }

  if (record.clientId !== client.clientId) {
    return oauthError("invalid_grant", "Code was issued to another client.", 400, NO_STORE);
  }
  if (record.redirectUri !== redirectUri) {
    return oauthError("invalid_grant", "redirect_uri does not match.", 400, NO_STORE);
  }
  if (!verifyPkce(verifier, record.codeChallenge)) {
    return oauthError("invalid_grant", "PKCE verification failed.", 400, NO_STORE);
  }
  if (record.resource && resource && record.resource !== resource) {
    return oauthError("invalid_target", "Resource indicator does not match.", 400, NO_STORE);
  }

  try {
    const grant = await ensureGrant(client, record.userId, record.scopes);
    const pair = await issueTokenPair({
      clientId: client.clientId,
      userId: record.userId,
      grantId: grant.id,
      scopes: record.scopes,
    });
    await touchClient(client.clientId);

    if (Math.random() < 0.02) {
      void pruneOAuthArtifacts().catch(() => undefined);
    }

    return tokenResponse({ ...pair, scopes: record.scopes });
  } catch (error) {
    if (error instanceof GrantError) {
      return oauthError("invalid_grant", error.message, 400, NO_STORE);
    }
    console.error("oauth.token.exchange_failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return oauthError("server_error", "Could not issue a token.", 500, NO_STORE);
  }
}

async function refreshTokens(input: {
  clientId: string;
  params: URLSearchParams;
}): Promise<Response> {
  const refreshToken = input.params.get("refresh_token") ?? "";
  if (!refreshToken) {
    return oauthError("invalid_request", "refresh_token is required.", 400, NO_STORE);
  }

  const rotated = await rotateRefreshToken(refreshToken);
  if (!rotated) {
    return oauthError(
      "invalid_grant",
      "The refresh token is invalid, expired, or revoked.",
      400,
      NO_STORE,
    );
  }
  if (rotated.clientId !== input.clientId) {
    return oauthError("invalid_grant", "Refresh token was issued to another client.", 400, NO_STORE);
  }

  await touchClient(input.clientId);
  return tokenResponse({
    accessToken: rotated.accessToken,
    refreshToken: rotated.refreshToken,
    expiresIn: rotated.expiresIn,
    scopes: rotated.scopes,
  });
}

export function OPTIONS(): Response {
  return oauthPreflight();
}
