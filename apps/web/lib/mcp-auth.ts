import { authenticate, hasScope, isWellFormedKey } from "@ux-kb/core";
import type { ApiKeyRecord, UserRecord } from "@ux-kb/core/store";
import { getKb } from "./kb";
import { getStore } from "./store";
import { getLimiter, QUOTAS } from "./rate-limit";
import { clientIp, hashIp } from "./request";
import { resourceMetadataUrl, SCOPES } from "./oauth/config";
import { findAccessToken, touchAccessToken } from "./oauth/service";
import { looksLikeAccessToken } from "./oauth/tokens";

const JSON_RPC_ERROR = -32000;

export interface RateInfo {
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export type AuthResult =
  | { ok: true; key: ApiKeyRecord; rate: RateInfo }
  | { ok: false; response: Response };

type BearerError = "invalid_token" | "insufficient_scope";

function rpcError(status: number, message: string): Response {
  return new Response(
    JSON.stringify({ jsonrpc: "2.0", error: { code: JSON_RPC_ERROR, message }, id: null }),
    {
      status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    },
  );
}

function tooMany(message: string, retryAfterMs: number): Response {
  const response = rpcError(429, message);
  response.headers.set("Retry-After", String(Math.max(1, Math.ceil(retryAfterMs / 1000))));
  return response;
}

/**
 * RFC 9728 challenge. Pointing at the metadata document is what lets an MCP
 * client discover the authorization server and register itself.
 */
function challenge(
  requestHeaders: Headers,
  error?: BearerError,
  description?: string,
): string {
  const parts = [
    'Bearer realm="ux-kb"',
    `resource_metadata="${resourceMetadataUrl(requestHeaders)}"`,
    `scope="${SCOPES.join(" ")}"`,
  ];
  if (error) {
    parts.push(`error="${error}"`);
    if (description) {
      parts.push(`error_description="${description.replace(/["\\]/g, "")}"`);
    }
  }
  return parts.join(", ");
}

/** Coarse per-IP limit for callers that fail authentication. */
async function anonymousLimit(request: Request): Promise<Response | null> {
  const ipKey = hashIp(clientIp(request.headers));
  const result = await getLimiter().check(ipKey, QUOTAS.ANON_PER_MINUTE, Date.now(), "minute");
  if (result.allowed) return null;
  return tooMany("Too many unauthenticated requests. Slow down.", result.retryAfterMs);
}

async function unauthenticated(
  request: Request,
  message: string,
  options: { status?: number; error?: BearerError; description?: string } = {},
): Promise<AuthResult> {
  const limited = await anonymousLimit(request);
  if (limited) return { ok: false, response: limited };
  const response = rpcError(options.status ?? 401, message);
  response.headers.set(
    "WWW-Authenticate",
    challenge(request.headers, options.error, options.description),
  );
  return { ok: false, response };
}

/** Shared key checks: scope, pinning, suspension, and both rate windows. */
async function finishAuth(key: ApiKeyRecord, owner: UserRecord | null): Promise<AuthResult> {
  const kb = getKb();

  if (!hasScope(key, "mcp:read")) {
    return { ok: false, response: rpcError(403, "This credential does not grant mcp:read") };
  }

  if (key.pinnedVersion && key.pinnedVersion !== kb.version) {
    return {
      ok: false,
      response: rpcError(
        409,
        `Key is pinned to ${key.pinnedVersion}, but this deployment serves ${kb.version}.`,
      ),
    };
  }

  if (owner?.suspendedAt) {
    return { ok: false, response: rpcError(403, "This account is suspended") };
  }

  const now = Date.now();
  const minute = await getLimiter().check(key.id, key.rateLimit, now, "minute");
  if (!minute.allowed) {
    return {
      ok: false,
      response: tooMany("Rate limit exceeded for this API key", minute.retryAfterMs),
    };
  }

  const dailyLimit = owner?.role === "ADMIN" ? QUOTAS.ADMIN_PER_DAY : QUOTAS.MEMBER_PER_DAY;
  const daily = await getLimiter().check(key.id, dailyLimit, now, "day");
  if (!daily.allowed) {
    return {
      ok: false,
      response: tooMany("Daily quota exceeded for this API key", daily.retryAfterMs),
    };
  }

  return {
    ok: true,
    key,
    rate: {
      limit: key.rateLimit,
      remaining: minute.remaining,
      resetSeconds: Math.ceil((60_000 - (now % 60_000)) / 1000),
    },
  };
}

/**
 * OAuth access tokens ("uxko_") resolve to the grant's hidden API key so the
 * MCP server keeps using one credential model for sessions, usage, and limits.
 */
async function authorizeOAuthToken(request: Request, token: string): Promise<AuthResult> {
  let row: Awaited<ReturnType<typeof findAccessToken>>;
  try {
    row = await findAccessToken(token);
  } catch {
    return { ok: false, response: rpcError(503, "Authentication backend unavailable") };
  }

  if (!row || row.revokedAt) {
    return unauthenticated(request, "Missing, invalid, or revoked access token", {
      error: "invalid_token",
      description: "The access token is invalid or revoked.",
    });
  }

  if (row.expiresAt.getTime() <= Date.now()) {
    return unauthenticated(request, "Access token expired", {
      error: "invalid_token",
      description: "The access token has expired.",
    });
  }

  if (row.grant.revokedAt) {
    return unauthenticated(request, "The authorization grant was revoked", {
      error: "invalid_token",
    });
  }

  if (!row.scopes.includes("mcp:read")) {
    return unauthenticated(request, "This token does not grant mcp:read", {
      status: 403,
      error: "insufficient_scope",
      description: "The token lacks the mcp:read scope.",
    });
  }

  const key = row.grant.apiKey;
  const keyUsable =
    key &&
    !key.revokedAt &&
    (!key.expiresAt || key.expiresAt.getTime() > Date.now());
  if (!keyUsable) {
    return unauthenticated(request, "The underlying access key is no longer valid", {
      error: "invalid_token",
      description: "The authorization has been revoked or expired.",
    });
  }

  const owner = row.user as UserRecord;
  if (owner.suspendedAt) {
    return { ok: false, response: rpcError(403, "This account is suspended") };
  }

  // Keep write amplification low: at most one update per minute.
  if (!row.lastUsedAt || Date.now() - row.lastUsedAt.getTime() > 60_000) {
    void touchAccessToken(row.id).catch(() => undefined);
  }

  return finishAuth(key, owner);
}

export async function authorize(request: Request): Promise<AuthResult> {
  const header = request.headers.get("authorization");
  const raw = header?.trim() ?? "";
  const presented = raw.toLowerCase().startsWith("bearer ") ? raw.slice(7).trim() : raw;

  if (!presented) {
    return unauthenticated(request, "Missing API key or OAuth access token");
  }

  if (looksLikeAccessToken(presented)) {
    return authorizeOAuthToken(request, presented);
  }

  // Reject malformed keys before touching the database, but still rate limit
  // the caller so key guessing stays expensive.
  if (!isWellFormedKey(presented)) {
    return unauthenticated(request, "Missing, invalid, or revoked API key");
  }

  const store = await getStore();
  let key: ApiKeyRecord | null;
  try {
    // Store only a pseudonymous IP on the key record.
    key = await authenticate(store, header ?? undefined, {
      ip: hashIp(clientIp(request.headers)),
    });
  } catch {
    return { ok: false, response: rpcError(503, "Authentication backend unavailable") };
  }

  if (!key) {
    return unauthenticated(request, "Missing, invalid, or revoked API key");
  }

  let owner: UserRecord | null = null;
  if (key.ownerId) {
    owner = await store.getUser(key.ownerId);
  }

  return finishAuth(key, owner);
}
