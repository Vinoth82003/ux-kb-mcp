/**
 * End-to-end MCP smoke test over stdio.
 *
 *   pnpm --filter @ux-kb/mcp-server smoke
 *
 * Spawns the server, then exercises all seven Phase 3 tools and the resources
 * through the official SDK client.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const serverEntry = resolve(here, "../src/index.ts");

let failures = 0;

function check(name: string, condition: boolean, detail = ""): void {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function textOf(result: Awaited<ReturnType<Client["callTool"]>>): string {
  const content = (result as { content?: Array<{ type: string; text?: string }> }).content ?? [];
  return content.map((item) => item.text ?? "").join("\n");
}

function resourceText(contents: Array<{ text?: string; blob?: string }>): string {
  return contents.map((item) => item.text ?? "").join("\n");
}

function parseJson<T>(text: string): T | undefined {
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["--import", "tsx", serverEntry],
  env: { ...process.env, KB_STORE: "memory", DATABASE_URL: "" },
  stderr: "pipe",
});

const client = new Client({ name: "ux-kb-smoke", version: "0.2.0" });

try {
  await client.connect(transport);

  const tools = await client.listTools();
  const toolNames = tools.tools.map((tool) => tool.name).sort();
  check(
    "seven tools registered",
    toolNames.join(",") ===
      "get_checklist,get_doc,get_stage_pack,report_gap,search_kb,start_session,verify_citations",
    toolNames.join(","),
  );

  const started = await client.callTool({
    name: "start_session",
    arguments: { feature: "pricing page with plans and cancellation" },
  });
  const startedText = textOf(started);
  const sessionId = /sessionId:\s*(\S+)/.exec(startedText)?.[1];
  check("start_session returns a session", Boolean(sessionId) && startedText.includes("kbVersion"));
  if (!sessionId) throw new Error("Cannot continue without a sessionId");

  const pack = await client.callTool({
    name: "get_stage_pack",
    arguments: { sessionId, stage: "proposal" },
  });
  const packText = textOf(pack);
  check(
    "get_stage_pack includes core + routed docs",
    packText.includes("UX-KB Core Agent Rules") &&
      packText.includes("SAAS-006") &&
      packText.includes("VIS-001"),
  );

  const doc = await client.callTool({
    name: "get_doc",
    arguments: { sessionId, id: "CMP-001" },
  });
  check("get_doc returns CMP-001", textOf(doc).includes("CMP-001") && textOf(doc).includes("## MUST"));

  const missing = await client.callTool({
    name: "get_doc",
    arguments: { sessionId, id: "NOPE-999" },
  });
  check("get_doc rejects unknown ID", Boolean((missing as { isError?: boolean }).isError));

  const search = await client.callTool({
    name: "search_kb",
    arguments: { query: "loading state", limit: 5 },
  });
  check("search_kb returns results", textOf(search).includes("INT-005"));

  const checklist = await client.callTool({
    name: "get_checklist",
    arguments: { ids: ["CMP-001"] },
  });
  const checklistData = parseJson<{ count: number; items: Array<{ docId: string }> }>(
    textOf(checklist),
  );
  check(
    "get_checklist returns only CHECK items",
    Boolean(checklistData?.count) &&
      checklistData?.items.every((item) => item.docId === "CMP-001") === true,
  );

  const citations = await client.callTool({
    name: "verify_citations",
    arguments: { sessionId, citedIds: ["CMP-001", "SAAS-002"] },
  });
  const citationReport = parseJson<{
    unfetched: string[];
    unknown: string[];
    compliant: boolean;
  }>(textOf(citations));
  check(
    "verify_citations catches an unfetched citation",
    citationReport?.unfetched.includes("SAAS-002") === true &&
      citationReport?.compliant === false,
  );

  const gap = await client.callTool({
    name: "report_gap",
    arguments: { topic: "offline sync conflict UI", context: "Smoke test gap" },
  });
  check("report_gap acknowledges the gap", textOf(gap).includes("Gap logged"));

  const resources = await client.listResources();
  check(
    "resources listed",
    resources.resources.some((resource) => resource.uri === "kb://core"),
  );

  const core = await client.readResource({ uri: "kb://core" });
  const coreText = resourceText(core.contents);
  check(
    "kb://core has rules + anti-slop",
    coreText.includes("UX-KB Core Agent Rules") && coreText.includes("Anti-AI-Slop"),
  );

  const resourceDoc = await client.readResource({ uri: "kb://doc/VIS-002" });
  check(
    "kb://doc/VIS-002 readable",
    resourceText(resourceDoc.contents).includes("Typography"),
  );

  const resourcePack = await client.readResource({ uri: "kb://pack/audit" });
  check(
    "kb://pack/audit readable",
    resourceText(resourcePack.contents).includes("Stage pack: audit"),
  );
} catch (error) {
  failures += 1;
  console.error("Smoke test crashed:", error);
} finally {
  await client.close().catch(() => undefined);
}

console.log(failures === 0 ? "\nAll smoke checks passed." : `\n${failures} check(s) failed.`);
process.exitCode = failures === 0 ? 0 : 1;
