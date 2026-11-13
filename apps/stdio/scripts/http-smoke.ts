/**
 * End-to-end HTTP smoke test.
 *
 *   pnpm --filter @ux-kb/mcp-server smoke:http
 *
 * Boots the stateless Streamable HTTP server with an in-memory store and a
 * deliberately tiny rate limit, then checks auth, the MCP handshake, a tool
 * call and 429 handling. A second in-process app covers version pinning and
 * revoked keys.
 */
import { spawn } from "node:child_process";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createApiKey, createKb } from "@ux-kb/core";
import { MemoryStore } from "@ux-kb/core/store";
import { createHttpApp } from "../src/http";

const here = dirname(fileURLToPath(import.meta.url));
const serverEntry = resolve(here, "../src/index.ts");
const port = 3461;
const baseUrl = `http://127.0.0.1:${port}`;
const devKey = "test-key-phase3";
const rateLimit = 2;

let failures = 0;

function check(name: string, condition: boolean, detail = ""): void {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const sleep = (ms: number) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

const child = spawn(process.execPath, ["--import", "tsx", serverEntry, "--http"], {
  cwd: resolve(here, ".."),
  env: {
    ...process.env,
    NODE_ENV: "test",
    KB_STORE: "memory",
    MCP_PORT: String(port),
    MCP_HOST: "127.0.0.1",
    MCP_DEV_KEY: devKey,
    MCP_DEV_KEY_RATE_LIMIT: String(rateLimit),
    KEY_HASH_SECRET: "test-secret",
    DATABASE_URL: "",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverStderr = "";
child.stderr?.on("data", (chunk: Buffer) => {
  serverStderr += chunk.toString();
});
child.stdout?.on("data", () => undefined);

async function waitForServer(): Promise<boolean> {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) return false;
    try {
      const response = await fetch(`${baseUrl}/healthz`);
      if (response.ok) return true;
    } catch {
      // Not listening yet.
    }
    await sleep(250);
  }
  return false;
}

function rpcPost(
  body: unknown,
  authorization?: string,
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (authorization) headers.Authorization = authorization;
  return fetch(`${baseUrl}/mcp`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

interface RpcResponse {
  jsonrpc?: string;
  id?: number;
  result?: {
    serverInfo?: { name?: string };
    content?: Array<{ type: string; text?: string }>;
  };
  error?: { code?: number; message?: string };
}

async function readRpc(response: Response): Promise<RpcResponse | undefined> {
  try {
    return (await response.json()) as RpcResponse;
  } catch {
    return undefined;
  }
}

try {
  const ready = await waitForServer();
  check(
    "server starts and serves /healthz",
    ready,
    `exit=${child.exitCode} stderr=${serverStderr.trim()}`,
  );
  if (!ready) throw new Error("HTTP server did not start");

  const health = await fetch(`${baseUrl}/healthz`);
  const healthBody = (await health.json()) as { ok?: boolean; docs?: number };
  check(
    "healthz reports a loaded KB",
    healthBody.ok === true && (healthBody.docs ?? 0) > 0,
    JSON.stringify(healthBody),
  );

  const unauthenticated = await rpcPost({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "http-smoke", version: "0.2.0" },
    },
  });
  check(
    "missing key is rejected with 401",
    unauthenticated.status === 401 &&
      Boolean(unauthenticated.headers.get("www-authenticate")),
    `status=${unauthenticated.status}`,
  );

  const wrongKey = await rpcPost(
    {
      jsonrpc: "2.0",
      id: 2,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "http-smoke", version: "0.2.0" },
      },
    },
    "Bearer not-a-real-key",
  );
  check("invalid key is rejected with 401", wrongKey.status === 401, `status=${wrongKey.status}`);

  const initialized = await rpcPost(
    {
      jsonrpc: "2.0",
      id: 3,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "http-smoke", version: "0.2.0" },
      },
    },
    `Bearer ${devKey}`,
  );
  const initBody = await readRpc(initialized);
  check(
    "valid key completes initialize",
    initialized.status === 200 && initBody?.result?.serverInfo?.name === "ux-kb",
    `status=${initialized.status} body=${JSON.stringify(initBody)}`,
  );

  const started = await rpcPost(
    {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "start_session",
        arguments: { feature: "pricing page with plans and cancellation" },
      },
    },
    `Bearer ${devKey}`,
  );
  const startedBody = await readRpc(started);
  const startedText = (startedBody?.result?.content ?? [])
    .map((item) => item.text ?? "")
    .join("\n");
  check(
    "start_session works over HTTP",
    started.status === 200 && /sessionId:\s*\S+/.test(startedText),
    `status=${started.status} body=${JSON.stringify(startedBody)}`,
  );

  const limited = await rpcPost(
    {
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: { name: "search_kb", arguments: { query: "loading state" } },
    },
    `Bearer ${devKey}`,
  );
  const retryAfter = limited.headers.get("retry-after");
  check(
    "rate limit returns 429 with Retry-After",
    limited.status === 429 && Boolean(retryAfter) && Number(retryAfter) >= 1,
    `status=${limited.status} retry-after=${retryAfter}`,
  );

  // Version pinning and revocation run against a second in-process app so the
  // tiny rate limit above does not interfere.
  const pinStore = new MemoryStore();
  const pinned = await createApiKey(pinStore, { name: "pinned", pinnedVersion: "0.0.0" });
  const revoked = await createApiKey(pinStore, { name: "revoked" });
  await pinStore.revokeKey(revoked.record.id);

  const pinApp = createHttpApp({ kb: createKb(), store: pinStore });
  const pinServer = pinApp.listen(0, "127.0.0.1");
  await once(pinServer, "listening");
  const pinPort = (pinServer.address() as AddressInfo).port;
  const pinUrl = `http://127.0.0.1:${pinPort}/mcp`;

  const initializeBody = {
    jsonrpc: "2.0",
    id: 10,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "http-smoke", version: "0.2.0" },
    },
  };

  const pinnedResponse = await fetch(pinUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${pinned.key}` },
    body: JSON.stringify(initializeBody),
  });
  check(
    "key pinned to another release is rejected with 409",
    pinnedResponse.status === 409,
    `status=${pinnedResponse.status}`,
  );

  const revokedResponse = await fetch(pinUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${revoked.key}` },
    body: JSON.stringify(initializeBody),
  });
  check(
    "revoked key is rejected with 401",
    revokedResponse.status === 401,
    `status=${revokedResponse.status}`,
  );

  const closed = once(pinServer, "close");
  pinServer.close();
  await closed;
} catch (error) {
  failures += 1;
  console.error("HTTP smoke test crashed:", error);
  if (serverStderr.trim()) console.error(serverStderr.trim());
} finally {
  child.kill();
  await sleep(250);
  if (child.exitCode === null) {
    child.kill("SIGKILL");
  }
}

console.log(failures === 0 ? "\nAll HTTP smoke checks passed." : `\n${failures} check(s) failed.`);
process.exitCode = failures === 0 ? 0 : 1;
