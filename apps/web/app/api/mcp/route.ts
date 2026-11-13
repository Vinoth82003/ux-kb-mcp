import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { buildServer } from "@ux-kb/mcp";
import { getKb } from "@/lib/kb";
import { getStore } from "@/lib/store";
import { authorize } from "@/lib/mcp-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const JSON_RPC_ERROR = -32000;

function corsHeaders(): Headers {
  const h = new Headers();
  const origin = process.env.ADMIN_ORIGIN?.trim();
  if (origin) {
    h.set("Access-Control-Allow-Origin", origin);
    h.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Mcp-Session-Id");
    h.set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
  }
  return h;
}

function rpcError(status: number, message: string): Response {
  return new Response(JSON.stringify({ jsonrpc: "2.0", error: { code: JSON_RPC_ERROR, message }, id: null }), {
    status,
    headers: { "Content-Type": "application/json", ...Object.fromEntries(corsHeaders()) },
  });
}

async function handle(request: Request): Promise<Response> {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const kb = getKb();
  const store = await getStore();
  const server = buildServer({ kb, store, apiKey: auth.key });
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  const response = await transport.handleRequest(request);
  const headers = new Headers(response.headers);
  for (const [k, v] of corsHeaders()) headers.set(k, v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export async function POST(request: Request) {
  return handle(request);
}

export function GET() {
  return rpcError(405, "SSE is not supported in stateless mode");
}

export function DELETE() {
  return rpcError(405, "No session to delete in stateless mode");
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
