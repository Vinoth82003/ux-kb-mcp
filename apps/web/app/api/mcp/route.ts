import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { buildServer } from "@ux-kb/mcp";
import { getKb } from "@/lib/kb";
import { getStore } from "@/lib/store";
import { authorize } from "@/lib/mcp-auth";
import { tryAcquire } from "@/lib/concurrency";
import { getLimiter, QUOTAS } from "@/lib/rate-limit";
import { requestId } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BODY_BYTES = 256 * 1024;
const MAX_BATCH_ITEMS = 20;
const JSON_RPC_ERROR = -32000;

function corsHeaders(): Headers {
  const headers = new Headers();
  const origin = process.env.ADMIN_ORIGIN?.trim();
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Mcp-Session-Id");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Vary", "Origin");
  }
  return headers;
}

function rpcError(status: number, message: string, extra?: Record<string, string>): Response {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    ...extra,
  });
  for (const [key, value] of corsHeaders()) headers.set(key, value);
  return new Response(
    JSON.stringify({ jsonrpc: "2.0", error: { code: JSON_RPC_ERROR, message }, id: null }),
    { status, headers },
  );
}

/** Count `start_session` calls in a single request or a batch. */
function countStartSessions(payload: unknown): number {
  const items = Array.isArray(payload) ? payload : [payload];
  let count = 0;
  for (const item of items) {
    if (typeof item !== "object" || item === null) continue;
    const candidate = item as { method?: string; params?: { name?: string } };
    if (candidate.method === "tools/call" && candidate.params?.name === "start_session") {
      count += 1;
    }
  }
  return count;
}

async function handle(request: Request): Promise<Response> {
  const rid = requestId();
  const release = tryAcquire();
  if (!release) {
    return rpcError(503, "Server is busy. Retry shortly.", { "Retry-After": "2" });
  }

  try {
    const auth = await authorize(request);
    if (!auth.ok) return auth.response;

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return rpcError(415, "Content-Type must be application/json");
    }

    const declared = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return rpcError(413, "Request body is too large");
    }

    const text = await request.text();
    if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) {
      return rpcError(413, "Request body is too large");
    }

    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      return rpcError(400, "Parse error: Invalid JSON");
    }

    if (Array.isArray(payload) && payload.length > MAX_BATCH_ITEMS) {
      return rpcError(400, `Batch requests are limited to ${MAX_BATCH_ITEMS} items`);
    }

    const sessionCalls = countStartSessions(payload);
    for (let index = 0; index < sessionCalls; index += 1) {
      const cap = await getLimiter().check(
        `sessions:${auth.key.id}`,
        QUOTAS.SESSIONS_PER_HOUR,
        Date.now(),
        "hour",
      );
      if (!cap.allowed) {
        return rpcError(429, "Too many sessions created in the last hour", {
          "Retry-After": String(Math.max(1, Math.ceil(cap.retryAfterMs / 1000))),
        });
      }
    }

    // Opportunistic cleanup so the window table does not grow without bound
    // even if the daily cron is disabled.
    if (Math.random() < 0.01) {
      void getLimiter()
        .prune()
        .catch(() => undefined);
    }

    // Rebuild the request because the body stream was consumed above.
    const rebuilt = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: text,
    });

    const kb = getKb();
    const store = await getStore();
    const server = buildServer({ kb, store, apiKey: auth.key });
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    await server.connect(transport);
    const response = await transport.handleRequest(rebuilt);

    const headers = new Headers(response.headers);
    for (const [key, value] of corsHeaders()) headers.set(key, value);
    headers.set("Cache-Control", "no-store");
    headers.set("X-Request-Id", rid);
    headers.set("X-RateLimit-Limit", String(auth.rate.limit));
    headers.set("X-RateLimit-Remaining", String(auth.rate.remaining));
    headers.set("X-RateLimit-Reset", String(auth.rate.resetSeconds));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error("mcp.unhandled", {
      requestId: rid,
      error: error instanceof Error ? error.message : String(error),
    });
    return rpcError(500, "Internal error");
  } finally {
    release();
  }
}

export async function POST(request: Request) {
  return handle(request);
}

export function GET() {
  return rpcError(405, "SSE is not supported in stateless mode", { Allow: "POST" });
}

export function DELETE() {
  return rpcError(405, "No session to delete in stateless mode", { Allow: "POST" });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
