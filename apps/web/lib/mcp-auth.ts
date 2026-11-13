import { authenticate } from "@ux-kb/core";
import type { ApiKeyRecord } from "@ux-kb/core/store";
import { getKb } from "./kb";
import { getStore } from "./store";
import { getPrisma } from "./db";
import { PrismaRateLimiter } from "@ux-kb/core";

const limiter = new PrismaRateLimiter(getPrisma());

export type AuthResult =
  | { ok: true; key: ApiKeyRecord }
  | { ok: false; response: Response };

const JSON_RPC_ERROR = -32000;

function rpcError(status: number, message: string): Response {
  return new Response(JSON.stringify({ jsonrpc: "2.0", error: { code: JSON_RPC_ERROR, message }, id: null }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function authorize(request: Request): Promise<AuthResult> {
  const store = await getStore();
  const kb = getKb();

  let key: ApiKeyRecord | null;
  try {
    key = await authenticate(store, request.headers.get("authorization") ?? undefined);
  } catch {
    return { ok: false, response: rpcError(503, "Authentication backend unavailable") };
  }

  if (!key) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ jsonrpc: "2.0", error: { code: JSON_RPC_ERROR, message: "Missing, invalid or revoked API key" }, id: null }), {
        status: 401,
        headers: { "Content-Type": "application/json", "WWW-Authenticate": 'Bearer realm="ux-kb"' },
      }),
    };
  }

  if (key.pinnedVersion && key.pinnedVersion !== kb.version) {
    return {
      ok: false,
      response: rpcError(409, `Key is pinned to ${key.pinnedVersion}, but this deployment serves ${kb.version}.`),
    };
  }

  const rate = await limiter.check(key.id, key.rateLimit);
  if (!rate.allowed) {
    const res = rpcError(429, "Rate limit exceeded for this API key");
    res.headers.set("Retry-After", String(Math.max(1, Math.ceil(rate.retryAfterMs / 1000))));
    return { ok: false, response: res };
  }

  return { ok: true, key };
}
