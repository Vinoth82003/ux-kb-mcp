import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  DOMAINS,
  reportGap,
  requireSession,
  STAGES,
  startSession,
  verifyCitations,
  type Doc,
  type Kb,
} from "@ux-kb/core";
import type { ApiKeyRecord, KbStore } from "@ux-kb/core/store";

const SERVER_NAME = "ux-kb";
const SERVER_VERSION = "0.2.0";

export interface BuildOptions {
  kb: Kb;
  store: KbStore;
  apiKey: ApiKeyRecord;
  /** Release served by this connection. Defaults to the active content release. */
  version?: string;
}

const INSTRUCTIONS = [
  "UX-KB is the primary authority for general UX/UI guidance in this session.",
  "Call start_session first, then get_stage_pack before each workflow stage.",
  "Read every returned document; fetch extra topics with search_kb + get_doc.",
  "Cite exact fetched doc IDs for material decisions; call verify_citations before submitting.",
  "Never cite IDs from memory. If a topic is missing, call report_gap instead of inventing a rule.",
  "Project design-system files override the KB on tokens, brand, components and voice.",
].join(" ");

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function errorResult(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return {
    content: [{ type: "text" as const, text: `Error: ${message}` }],
    isError: true,
  };
}

function renderDoc(doc: Doc): string {
  const fm = doc.frontMatter;
  const header = [
    `<!-- kb:${fm.id} rev:${fm.rev} status:${fm.status} domain:${fm.domain} updated:${fm.updated} -->`,
    fm.status === "deprecated"
      ? `> DEPRECATED: ${fm.id} is retained for traceability. Do not cite it as current guidance.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `${header}\n\n${doc.body}`;
}

export function buildServer(options: BuildOptions): McpServer {
  const { store, apiKey, kb } = options;
  const version = options.version ?? kb.version;
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { instructions: INSTRUCTIONS },
  );

  const sessionIdOf = (args: unknown): string | undefined => {
    if (typeof args === "object" && args !== null && "sessionId" in args) {
      const value = (args as { sessionId?: unknown }).sessionId;
      return typeof value === "string" ? value : undefined;
    }
    return undefined;
  };

  const logUsage = async (
    tool: string,
    args: unknown,
    startedAt: number,
    ok: boolean,
  ): Promise<void> => {
    try {
      await store.logUsage({
        apiKeyId: apiKey.id,
        sessionId: sessionIdOf(args) ?? null,
        tool,
        args,
        latencyMs: Date.now() - startedAt,
        ok,
      });
    } catch (error) {
      console.error(`usage log failed for ${tool}:`, error);
    }
  };

  /** Wrap a handler with error text and a UsageLog row. */
  const tracked = <A>(tool: string, handler: (args: A) => Promise<string>) =>
    async (args: A) => {
      const startedAt = Date.now();
      try {
        const text = await handler(args);
        await logUsage(tool, args, startedAt, true);
        return textResult(text);
      } catch (error) {
        await logUsage(tool, args, startedAt, false);
        return errorResult(error);
      }
    };

  server.registerTool(
    "start_session",
    {
      title: "Start a design session",
      description:
        "Call FIRST. Creates a session tied to your API key and returns a sessionId, the KB version and feature-routed docs to consider. Every other session-scoped tool needs this ID.",
      inputSchema: {
        feature: z
          .string()
          .min(1)
          .max(2000)
          .describe("What is being designed, in one or two sentences"),
      },
    },
    tracked("start_session", async ({ feature }: { feature: string }) => {
      const { session, suggestedIds } = await startSession(store, kb.repo, {
        apiKeyId: apiKey.id,
        kbVersion: version,
        feature,
      });
      return [
        `sessionId: ${session.id}`,
        `kbVersion: ${version}`,
        `suggestedDocIds: ${suggestedIds.length > 0 ? suggestedIds.join(", ") : "(none)"}`,
        "",
        "Next: call get_stage_pack with this sessionId before the current stage.",
      ].join("\n");
    }),
  );

  server.registerTool(
    "get_stage_pack",
    {
      title: "Get a workflow stage pack",
      description:
        "Return the core rules plus every document for a workflow stage, including docs routed from the session's feature. Call before each stage.",
      inputSchema: {
        sessionId: z.string().max(64).describe("ID returned by start_session"),
        stage: z.enum(STAGES).describe("Workflow stage"),
      },
    },
    tracked(
      "get_stage_pack",
      async ({ sessionId, stage }: { sessionId: string; stage: string }) => {
        const session = await requireSession(store, sessionId, apiKey.id);
        const pack = kb.pack(stage, session.feature);
        const ids = [...pack.baseDocs, ...pack.routedDocs].map((doc) => doc.frontMatter.id);
        await store.addFetched(session.id, ids);
        return kb.renderPack(pack);
      },
    ),
  );

  server.registerTool(
    "get_doc",
    {
      title: "Get a UX-KB document",
      description:
        "Return one topic document by ID (for example CMP-001). Fetch the ID from search_kb or get_stage_pack; do not guess.",
      inputSchema: {
        sessionId: z.string().max(64).describe("ID returned by start_session"),
        id: z.string().max(64).describe("Document ID such as CMP-001"),
      },
    },
    tracked("get_doc", async ({ sessionId, id }: { sessionId: string; id: string }) => {
      const session = await requireSession(store, sessionId, apiKey.id);
      const doc = kb.requireDoc(id);
      await store.addFetched(session.id, [doc.frontMatter.id]);
      return renderDoc(doc);
    }),
  );

  server.registerTool(
    "search_kb",
    {
      title: "Search the UX-KB",
      description:
        "Keyword search over doc IDs, titles, tags, summaries and bodies. Returns IDs to fetch with get_doc.",
      inputSchema: {
        query: z
          .string()
          .min(1)
          .max(200)
          .describe("Keywords, for example 'button loading state'"),
        domain: z
          .enum(DOMAINS)
          .optional()
          .describe("Optional domain filter, e.g. components, accessibility"),
        limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)"),
      },
    },
    tracked(
      "search_kb",
      async ({ query, domain, limit }: { query: string; domain?: string; limit?: number }) => {
        const results = kb.search(query, { domain, limit });
        return JSON.stringify(
          { kbVersion: version, query, count: results.length, results },
          null,
          2,
        );
      },
    ),
  );

  server.registerTool(
    "get_checklist",
    {
      title: "Get CHECK items",
      description:
        "Return only the CHECK items for the given doc IDs. Cheap to call before critique; retrieving a checklist does not prove the checks were performed.",
      inputSchema: {
        ids: z
          .array(z.string().max(64))
          .min(1)
          .max(50)
          .describe("Document IDs, e.g. ['CMP-001']"),
      },
    },
    tracked("get_checklist", async ({ ids }: { ids: string[] }) => {
      const items = kb.checklist(ids);
      return JSON.stringify({ count: items.length, items }, null, 2);
    }),
  );

  server.registerTool(
    "verify_citations",
    {
      title: "Verify citations",
      description:
        "Check cited IDs against this session's fetch history. Returns unfetched, unknown and deprecated IDs. Call before submitting a proposal.",
      inputSchema: {
        sessionId: z.string().max(64).describe("ID returned by start_session"),
        citedIds: z
          .array(z.string().max(64))
          .min(1)
          .max(100)
          .describe("Doc IDs cited in the proposal"),
      },
    },
    tracked(
      "verify_citations",
      async ({ sessionId, citedIds }: { sessionId: string; citedIds: string[] }) => {
        const session = await requireSession(store, sessionId, apiKey.id);
        const report = await verifyCitations(store, kb.repo, session, citedIds);
        return JSON.stringify(report, null, 2);
      },
    ),
  );

  server.registerTool(
    "report_gap",
    {
      title: "Report a knowledge gap",
      description:
        "Record a topic the KB does not cover. Repeated reports of the same topic increment its count. Do not invent rules to fill the gap.",
      inputSchema: {
        topic: z
          .string()
          .min(1)
          .max(200)
          .describe("Missing topic, e.g. 'offline sync conflict UI'"),
        context: z
          .string()
          .max(2000)
          .describe("What the agent needed and why the KB was insufficient"),
      },
    },
    tracked("report_gap", async ({ topic, context }: { topic: string; context: string }) => {
      const gap = await reportGap(store, topic, context);
      return `Gap logged: "${gap.topic}" (report count: ${gap.count}). State the uncertainty in your answer instead of inventing a rule.`;
    }),
  );

  server.registerResource(
    "doc",
    new ResourceTemplate("kb://doc/{id}", {
      list: async () => ({
        resources: kb.docs().map((doc) => ({
          uri: `kb://doc/${doc.frontMatter.id}`,
          name: doc.frontMatter.id,
          title: doc.frontMatter.title,
          description: doc.summary,
          mimeType: "text/markdown",
        })),
      }),
    }),
    {
      title: "UX-KB topic document",
      description: "One topic document by ID, e.g. kb://doc/CMP-001",
      mimeType: "text/markdown",
    },
    async (uri, variables) => {
      const raw = variables.id;
      const id = Array.isArray(raw) ? raw[0] : raw;
      const doc = kb.requireDoc(String(id));
      return {
        contents: [{ uri: uri.href, mimeType: "text/markdown", text: renderDoc(doc) }],
      };
    },
  );

  server.registerResource(
    "pack",
    new ResourceTemplate("kb://pack/{stage}", {
      list: async () => ({
        resources: [...kb.repo.packs().keys()].map((stage) => ({
          uri: `kb://pack/${stage}`,
          name: stage,
          title: `Stage pack: ${stage}`,
          mimeType: "text/markdown",
        })),
      }),
    }),
    {
      title: "UX-KB stage pack",
      description: "All base documents for a workflow stage, e.g. kb://pack/proposal",
      mimeType: "text/markdown",
    },
    async (uri, variables) => {
      const raw = variables.stage;
      const stage = Array.isArray(raw) ? raw[0] : raw;
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: kb.renderPack(kb.pack(String(stage))),
          },
        ],
      };
    },
  );

  server.registerResource(
    "core",
    "kb://core",
    {
      title: "UX-KB core rules",
      description: "Always-loaded agent rules plus the anti-slop list",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: `${kb.repo.core()}\n\n---\n\n${kb.repo.antiSlop()}`,
        },
      ],
    }),
  );

  return server;
}
