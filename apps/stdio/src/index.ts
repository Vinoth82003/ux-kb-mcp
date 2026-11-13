import { createKb, ensureLocalKey } from "@ux-kb/core";
import { createStore } from "@ux-kb/core/store";
import { buildServer } from "@ux-kb/mcp";

const useHttp = process.argv.includes("--http") || process.env.MCP_TRANSPORT === "http";

const kb = createKb();

if (useHttp) {
  const { startHttp } = await import("./http");
  await startHttp(kb);
} else {
  const store = await createStore();
  const apiKey = await ensureLocalKey(store);
  const { StdioServerTransport } = await import("@modelcontextprotocol/sdk/server/stdio.js");
  const server = buildServer({ kb, store, apiKey });
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `ux-kb MCP server ready on stdio (KB ${kb.version}, ${kb.docs().length} docs, session ${apiKey.name})`,
  );
}
