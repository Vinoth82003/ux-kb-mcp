import { authenticate, hasScope, isWellFormedKey } from "@ux-kb/core";
import type { ApiKeyRecord, UserRecord } from "@ux-kb/core/store";
import { getKb } from "./kb";
import { getStore } from "./store";
import { getLimiter, QUOTAS } from "./rate-limit";
import { clientIp, hashIp } from "./request";

const JSON_RPC_ERROR = -32000;

export interface RateInfo {
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export type AuthResult =
  | { ok: true; key: ApiKeyRecord; rate: RateInfo }
  | { ok: false; response: Response };

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

/** Coarse per-IP limit for callers that fail authentication. */
async function anonymousLimit(request: Request): Promise<Response | null> {
  const ipKey = hashIp(clientIp(request.headers));
  const result = await getLimiter().check(ipKey, QUOTAS.ANON_PER_MINUTE, Date.now(), "minute");
  if (result.allowed) return null;
  return tooMany("Too many unauthenticated requests. Slow down.", result.retryAfterMs);
}

export async function authorize(request: Request): Promise<AuthResult> {
  const store = await getStore();
  const kb = getKb();

  const header = request.headers.get("authorization");
  const raw = header?.trim() ?? "";
  const presented = raw.toLowerCase().startsWith("bearer ") ? raw.slice(7).trim() : raw;

  // Reject malformed keys before touching the database, but still rate limit
  // the caller so key guessing stays expensive.
  if (!presented || !isWellFormedKey(presented)) {
    const limited = await anonymousLimit(request);
    if (limited) return { ok: false, response: limited };
    const response = rpcError(401, "Missing, invalid, or revoked API key");
    response.headers.set("WWW-Authenticate", 'Bearer realm="ux-kb"');
    return { ok: false, response };
  }

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
    const limited = await anonymousLimit(request);
    if (limited) return { ok: false, response: limited };
    const response = rpcError(401, "Missing, invalid, or revoked API key");
    response.headers.set("WWW-Authenticate", 'Bearer realm="ux-kb"');
    return { ok: false, response };
  }

  if (!hasScope(key, "mcp:read")) {
    return { ok: false, response: rpcError(403, "This key does not grant mcp:read") };
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

  let owner: UserRecord | null = null;
  if (key.ownerId) {
    owner = await store.getUser(key.ownerId);
    if (owner?.suspendedAt) {
      return { ok: false, response: rpcError(403, "This account is suspended") };
    }
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
