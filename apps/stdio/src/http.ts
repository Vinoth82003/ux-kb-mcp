import express, { type RequestHandler } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  authenticate,
  ensureDevKey,
  RateLimiter,
  type Kb,
} from "@ux-kb/core";
import { createStore, type ApiKeyRecord, type KbStore } from "@ux-kb/core/store";
import { buildServer } from "@ux-kb/mcp";

const JSON_RPC_ERROR = -32000;

export interface HttpDeps {
  kb: Kb;
  store: KbStore;
  limiter?: RateLimiter;
}

function rpcError(res: express.Response, status: number, code: number, message: string): void {
  res.status(status).json({ jsonrpc: "2.0", error: { code, message }, id: null });
}

export function createHttpApp({ kb, store, limiter = new RateLimiter() }: HttpDeps): express.Express {
  const app = express();
  const adminOrigin = process.env.ADMIN_ORIGIN?.trim();

  app.use(express.json({ limit: "1mb" }));

  if (adminOrigin) {
    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", adminOrigin);
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Mcp-Session-Id");
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
      if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
      }
      next();
    });
  }

  app.get("/healthz", (_req, res) => {
    res.json({
      ok: true,
      service: "ux-kb",
      kbVersion: kb.version,
      docs: kb.docs().length,
    });
  });

  // Auth -> revocation -> pin check -> rate limit. Every /mcp request needs a key.
  const requireKey: RequestHandler = async (req, res, next) => {
    let apiKey: ApiKeyRecord | null;
    try {
      apiKey = await authenticate(store, req.header("authorization"));
    } catch (error) {
      console.error("authentication failed:", error);
      rpcError(res, 503, JSON_RPC_ERROR, "Authentication backend unavailable");
      return;
    }

    if (!apiKey) {
      res.setHeader("WWW-Authenticate", 'Bearer realm="ux-kb"');
      rpcError(res, 401, JSON_RPC_ERROR, "Missing, invalid or revoked API key");
      return;
    }

    if (apiKey.pinnedVersion && apiKey.pinnedVersion !== kb.version) {
      rpcError(
        res,
        409,
        JSON_RPC_ERROR,
        `Key is pinned to ${apiKey.pinnedVersion}, but this deployment serves ${kb.version}. Deploy the pinned release or re-pin the key.`,
      );
      return;
    }

    const rate = limiter.check(apiKey.id, apiKey.rateLimit);
    if (!rate.allowed) {
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil(rate.retryAfterMs / 1000))));
      rpcError(res, 429, JSON_RPC_ERROR, "Rate limit exceeded for this API key");
      return;
    }

    res.locals.apiKey = apiKey;
    next();
  };

  app.use("/mcp", requireKey);

  // Stateless Streamable HTTP: one server + transport per request.
  app.post("/mcp", async (req, res) => {
    const apiKey = res.locals.apiKey as ApiKeyRecord;
    const server = buildServer({ kb, store, apiKey });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => {
      void transport.close();
      void server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("MCP request failed:", error);
      if (!res.headersSent) {
        rpcError(res, 500, JSON_RPC_ERROR, "Internal server error");
      }
    }
  });

  // Stateless mode has no long-lived SSE stream or session to delete.
  app.get("/mcp", (_req, res) => {
    rpcError(res, 405, JSON_RPC_ERROR, "SSE is not supported in stateless mode");
  });

  app.delete("/mcp", (_req, res) => {
    rpcError(res, 405, JSON_RPC_ERROR, "No session to delete in stateless mode");
  });

  return app;
}

export async function startHttp(kb: Kb): Promise<void> {
  const port = Number(process.env.MCP_PORT ?? 3333);
  const host = process.env.MCP_HOST ?? "127.0.0.1";

  if (process.env.NODE_ENV === "production" && !process.env.KEY_HASH_SECRET) {
    throw new Error("KEY_HASH_SECRET is required when NODE_ENV=production.");
  }

  const store = await createStore();
  const limiter = new RateLimiter();
  const devKey = process.env.MCP_DEV_KEY?.trim();
  if (devKey) {
    const rateLimit = Number(process.env.MCP_DEV_KEY_RATE_LIMIT ?? 120);
    await ensureDevKey(store, devKey, Number.isFinite(rateLimit) ? rateLimit : 120);
    console.error("Bootstrapped MCP_DEV_KEY for local HTTP use.");
  }

  const app = createHttpApp({ kb, store, limiter });
  app.listen(port, host, () => {
    console.error(
      `ux-kb MCP server listening on http://${host}:${port}/mcp (KB ${kb.version})`,
    );
  });
}
