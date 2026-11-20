import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  diffSince,
  DOMAINS,
  gateStatus,
  getChecklistDetailed,
  getDocContent,
  getDocs,
  reportCheck,
  reportFalsePositive,
  reportGap,
  requireSession,
  STAGES,
  startGate,
  startSession,
  topFailures,
  verifyCitations,
  type Doc,
  type Kb,
} from "@ux-kb/core";
import { assertStagePackAllowed, sessionMode, sessionPolicy, signEtag, VERIFY_CITATIONS_DEPRECATION } from "@ux-kb/core";
import type { ApiKeyRecord, KbStore } from "@ux-kb/core/store";

const SERVER_NAME = "ux-kb";
const SERVER_VERSION = "2.0.0";

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
        mode: z.enum(["quick", "audit", "full"]).optional().describe("Workflow mode"),
        screen: z.string().optional().describe("Screen name"),
        tokenBudget: z.number().int().optional().describe("Token budget"),
        idempotencyKey: z.string().optional().describe("Idempotency key"),
      },
    },
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const result = await startSession(store, kb.repo, {
          apiKeyId: apiKey.id,
          kbVersion: version,
          feature: args.feature,
          mode: args.mode,
          screen: args.screen,
          tokenBudget: args.tokenBudget,
          idempotencyKey: args.idempotencyKey,
        });
        const session = result.session;
        const mode = result.mode;
        const body = {
          kbVersion: version,
          sessionId: session.id,
          tokens: {
            estimated: 50,
            budget: session.tokenBudget ?? 30000,
            truncated: false,
            budgetRemaining: session.tokenBudget ?? 30000,
          },
          policy: sessionPolicy(session, version),
          data: {
            sessionId: session.id,
            mode,
            routing: {
              featureTags: result.featureTags,
              suggestedDocIds: result.suggestedIds,
              components: result.components,
            },
            nextSteps: result.nextSteps,
          },
        };
        await logUsage("start_session", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("start_session", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
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
        depth: z.enum(["checklist", "rules", "full"]).optional().describe("Content depth"),
        maxTokens: z.number().int().min(100).optional().describe("Token budget for this response"),
        page: z.number().int().min(1).optional().describe("Page number"),
      },
    },
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const { sessionId, stage } = args;
        const session = await requireSession(store, sessionId, apiKey.id);
        const mode = sessionMode(session);
        assertStagePackAllowed(mode, stage);
        const depth = args.depth ?? "rules";
        const maxTokens = args.maxTokens ?? 4000;
        const pack = kb.pack(stage, session.feature, {
          depth,
          maxTokens,
          page: args.page,
          deliveredIds: session.fetched,
        });
        const changedBase = pack.baseDocs;
        const changedRouted = pack.routedDocs;
        const allIds = pack.allIds ?? [];
        await store.addFetched(session.id, allIds);

        const depthSections =
          depth === "checklist" ? ["CHECK"] : depth === "rules" ? ["SUMMARY", "MUST", "CHECK"] : ["SUMMARY", "MUST", "SHOULD", "AVOID", "DECIDE", "STATES", "EXAMPLE", "FAILURE_MODES", "CHECK", "SOURCES", "RELATED"];

        const renderDocForPack = (doc: Doc) => {
          const content = getDocContent(kb.repo, doc.frontMatter.id, {
            sections: depthSections,
            includeSources: depth === "full",
            maxTokens: Number.POSITIVE_INFINITY,
          });
          return content.markdown ?? doc.body;
        };

        const baseDocs = changedBase.map((doc) => ({
          id: doc.frontMatter.id,
          etag: doc.etag,
          rev: doc.frontMatter.rev,
          markdown: renderDocForPack(doc),
        }));
        const routedDocs = changedRouted.map((doc) => ({
          id: doc.frontMatter.id,
          etag: doc.etag,
          rev: doc.frontMatter.rev,
          markdown: renderDocForPack(doc),
        }));

        const body = {
          kbVersion: version,
          sessionId: session.id,
          tokens: {
            estimated: pack.tokenEstimate,
            budget: maxTokens,
            truncated: pack.overBudget,
            budgetRemaining: session.tokenBudget ?? 30000,
          },
          policy: sessionPolicy(session, version),
          data: {
            stage: pack.stage,
            depth: pack.depth,
            maxTokens: pack.maxTokens,
            page: pack.page,
            totalPages: pack.totalPages,
            deferredIds: pack.deferredIds ?? [],
            unchangedIds: pack.unchangedIds ?? [],
            coreRules: pack.coreRules,
            antiSlop: pack.antiSlop,
            baseDocs,
            routedDocs,
            routedIds: pack.routedIds,
          },
        };
        await logUsage("get_stage_pack", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("get_stage_pack", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
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
        sections: z
          .array(z.string())
          .optional()
          .describe("Sections to include, e.g. ['MUST','CHECK']"),
        includeSources: z.boolean().optional().describe("Include SOURCES and RELATED"),
        ifNoneMatch: z.string().optional().describe("ETag from a previous fetch"),
        maxTokens: z.number().int().min(100).optional().describe("Token budget for this response"),
      },
    },
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const { sessionId, id } = args;
        const session = await requireSession(store, sessionId, apiKey.id);
        const content = getDocContent(kb.repo, id, {
          sections: args.sections,
          includeSources: args.includeSources,
          ifNoneMatch: args.ifNoneMatch,
          maxTokens: args.maxTokens,
        });
        if (!content.notModified) {
          await store.addFetched(session.id, [content.id]);
        }
        const budget = args.maxTokens ?? session.tokenBudget ?? 4000;
        const body = {
          kbVersion: version,
          sessionId: session.id,
          tokens: {
            estimated: content.estimatedTokens,
            budget,
            truncated: content.truncated,
            budgetRemaining: session.tokenBudget ?? 30000,
          },
          policy: sessionPolicy(session, version),
          data: {
            id: content.id,
            etag: content.etag,
            signature: signEtag(content.etag),
            rev: content.rev,
            notModified: content.notModified,
            markdown: content.markdown,
            sections: content.sections,
            deferred: content.deferred,
          },
        };
        await logUsage("get_doc", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("get_doc", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.registerTool(
    "get_docs",
    {
      title: "Get multiple UX-KB documents",
      description: "Batch fetch documents with a shared token budget.",
      inputSchema: {
        sessionId: z.string().max(64).describe("ID returned by start_session"),
        ids: z.array(z.string().max(64)).min(1).max(50).describe("Document IDs"),
        sections: z.array(z.string()).optional().describe("Sections to include"),
        includeSources: z.boolean().optional().describe("Include SOURCES and RELATED"),
        maxTokens: z.number().int().min(100).optional().describe("Shared token budget"),
      },
    },
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const { sessionId } = args;
        const session = await requireSession(store, sessionId, apiKey.id);
        const result = getDocs(kb.repo, args.ids, {
          sections: args.sections,
          includeSources: args.includeSources,
          maxTokens: args.maxTokens,
        });
        await store.addFetched(session.id, args.ids);
        const budget = args.maxTokens ?? 2500;
        const body = {
          kbVersion: version,
          sessionId: session.id,
          tokens: {
            estimated: result.estimatedTokens,
            budget,
            truncated: result.truncated,
            budgetRemaining: session.tokenBudget ?? 30000,
          },
          policy: sessionPolicy(session, version),
          data: {
            docs: result.docs.map((d: any) => ({
              ...d,
              signature: d.etag ? signEtag(d.etag) : undefined,
            })),
            deferred: result.deferred,
          },
        };
        await logUsage("get_docs", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("get_docs", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.registerTool(
    "start_gate",
    {
      title: "Start a screen gate",
      description: "Create the Screen Gate checklist for a screen.",
      inputSchema: {
        sessionId: z.string().max(64),
        screen: z.string().min(1),
        components: z.array(z.string()).default([]),
        screenType: z.enum(["list", "detail", "form", "dashboard", "settings", "auth", "empty-state", "other"]).default("other"),
        extraStates: z.array(z.string()).default([]),
      },
    },
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const session = await requireSession(store, args.sessionId, apiKey.id);
        const result = await startGate(store, kb.repo, session, {
          sessionId: args.sessionId,
          screen: args.screen,
          components: args.components ?? [],
          screenType: args.screenType ?? "other",
          extraStates: args.extraStates ?? [],
        });
        const body = {
          kbVersion: version,
          sessionId: session.id,
          tokens: { estimated: 200, budget: 1200, truncated: false, budgetRemaining: session.tokenBudget ?? 30000 },
          policy: sessionPolicy(session, version),
          data: result,
        };
        await logUsage("start_gate", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("start_gate", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.registerTool(
    "report_check",
    {
      title: "Report check results",
      description: "Record pass/fail/na/waive per gate item with evidence.",
      inputSchema: {
        sessionId: z.string().max(64),
        gateId: z.string().max(64),
        results: z.array(
          z.object({
            itemId: z.string(),
            result: z.enum(["pass", "fail", "na", "waive"]),
            evidence: z.array(z.object({ type: z.enum(["test", "file", "screenshot", "command_output", "url", "manual"]), ref: z.string().min(3).max(500) })).max(5).optional(),
            note: z.string().max(300).optional(),
            naReason: z.string().max(300).optional(),
            waiver: z.object({ by: z.literal("user"), reason: z.string().min(15), ticket: z.string().optional() }).optional(),
          }),
        ).min(1).max(50),
      },
    },
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const session = await requireSession(store, args.sessionId, apiKey.id);
        const result = await reportCheck(store, args.gateId, session.id, args.results);
        const body = {
          kbVersion: version,
          sessionId: session.id,
          tokens: { estimated: 120, budget: 400, truncated: false, budgetRemaining: session.tokenBudget ?? 30000 },
          policy: sessionPolicy(session, version),
          data: result,
        };
        await logUsage("report_check", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("report_check", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.registerTool(
    "gate_status",
    {
      title: "Gate status",
      description: "Authoritative done signal and recovery view.",
      inputSchema: {
        sessionId: z.string().max(64),
        gateId: z.string().max(64),
        view: z.enum(["summary", "open", "full"]).default("summary"),
      },
    },
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const session = await requireSession(store, args.sessionId, apiKey.id);
        const result = await gateStatus(store, args.gateId, session.id, args.view ?? "summary");
        const body = {
          kbVersion: version,
          sessionId: session.id,
          tokens: { estimated: args.view === "summary" ? 150 : 400, budget: 400, truncated: false, budgetRemaining: session.tokenBudget ?? 30000 },
          policy: sessionPolicy(session, version),
          data: result,
        };
        await logUsage("gate_status", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("gate_status", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
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
        depth: z.enum(["checks", "checks+verify"]).optional().describe("Include verify hints"),
      },
    },
    tracked("get_checklist", async ({ ids, depth }: { ids: string[]; depth?: "checks" | "checks+verify" }) => {
      const items = getChecklistDetailed(kb.repo, ids, depth ?? "checks");
      return JSON.stringify({ count: items.length, items }, null, 2);
    }),
  );

  server.registerTool(
    "report_false_positive",
    {
      title: "Report a false positive",
      description: "Flag a noisy or wrong check item. Counts toward the item's noise score.",
      inputSchema: {
        itemId: z.string().min(1).max(64),
        reason: z.string().min(5).max(500),
        context: z.string().max(2000).optional(),
        sessionId: z.string().max(64).optional(),
      },
    },
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const result = await reportFalsePositive(store, {
          itemId: args.itemId,
          reason: args.reason,
          context: args.context,
          sessionId: args.sessionId,
        });
        const body = {
          kbVersion: version,
          sessionId: args.sessionId ?? null,
          tokens: { estimated: 60, budget: 400, truncated: false, budgetRemaining: 30000 },
          policy: {},
          data: result,
        };
        await logUsage("report_false_positive", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("report_false_positive", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.registerTool(
    "top_failures",
    {
      title: "Top failing checks",
      description: "Most frequently failed item IDs with fail rate, aggregated anonymously.",
      inputSchema: {
        domain: z.string().optional(),
        limit: z.number().int().min(1).max(50).optional(),
        window: z.enum(["7d", "30d", "90d"]).optional(),
      },
    },
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const session = args.sessionId ? await requireSession(store, args.sessionId, apiKey.id) : null;
        const result = await topFailures(store, kb.repo, {
          domain: args.domain,
          limit: args.limit,
          window: args.window,
        });
        const body = {
          kbVersion: version,
          sessionId: session?.id ?? null,
          tokens: { estimated: 120, budget: 800, truncated: false, budgetRemaining: session?.tokenBudget ?? 30000 },
          policy: session ? sessionPolicy(session, version) : {},
          data: { items: result },
        };
        await logUsage("top_failures", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("top_failures", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
  );

  server.registerTool(
    "diff_since",
    {
      title: "Diff since a KB version",
      description: "Return docs and checklist items that changed since the given KB version.",
      inputSchema: {
        sessionId: z.string().max(64),
        sinceVersion: z.string().min(1).max(64),
        ids: z.array(z.string().max(64)).min(1).max(50),
      },
    },
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const session = await requireSession(store, args.sessionId, apiKey.id);
        const result = diffSince(kb.repo, {
          sessionId: args.sessionId,
          sinceVersion: args.sinceVersion,
          ids: args.ids,
        });
        const body = {
          kbVersion: version,
          sessionId: session.id,
          tokens: { estimated: 200, budget: 1200, truncated: false, budgetRemaining: session.tokenBudget ?? 30000 },
          policy: sessionPolicy(session, version),
          data: result,
        };
        await logUsage("diff_since", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("diff_since", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
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
    async (args: any) => {
      const startedAt = Date.now();
      try {
        const { sessionId, citedIds } = args;
        const session = await requireSession(store, sessionId, apiKey.id);
        const report = await verifyCitations(store, kb.repo, session, citedIds);
        const policy = sessionPolicy(session, version);
        policy.deprecations = [VERIFY_CITATIONS_DEPRECATION];
        const body = {
          kbVersion: version,
          sessionId: session.id,
          tokens: { estimated: 120, budget: 400, truncated: false, budgetRemaining: session.tokenBudget ?? 30000 },
          policy,
          data: report,
        };
        await logUsage("verify_citations", args, startedAt, true);
        return { content: [{ type: "text" as const, text: JSON.stringify(body, null, 2) }] };
      } catch (error) {
        await logUsage("verify_citations", args, startedAt, false);
        return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    },
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
