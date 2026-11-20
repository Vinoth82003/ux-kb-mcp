import type { ChecklistItem, Doc, Stage } from "../schemas/doc";
import type { ContentRepository } from "../content/repository";
import { extractChecklist } from "../content/parser";
import { estimateTokens } from "../content/tokens";
import { KbError } from "../errors";

export interface DocFilter {
  domain?: string;
  tag?: string;
  stage?: string;
  status?: string;
  priority?: string;
}

export function listDocs(repo: ContentRepository, filter: DocFilter = {}): Doc[] {
  return repo.docs().filter((doc) => {
    const fm = doc.frontMatter;
    if (filter.domain && fm.domain !== filter.domain) return false;
    if (filter.tag && !fm.tags.includes(filter.tag)) return false;
    if (filter.stage && !fm.stages.includes(filter.stage as Stage)) return false;
    if (filter.status && fm.status !== filter.status) return false;
    if (filter.priority && fm.priority !== filter.priority) return false;
    return true;
  });
}

export function getDoc(repo: ContentRepository, id: string): Doc | undefined {
  return repo.doc(id);
}

export function requireDoc(repo: ContentRepository, id: string): Doc {
  const doc = repo.doc(id);
  if (!doc) {
    throw new KbError(
      "DOC_NOT_FOUND",
      `Unknown document ID "${id}". Use search_kb to find valid IDs.`,
    );
  }
  return doc;
}

export function getChecklist(repo: ContentRepository, ids: string[]): ChecklistItem[] {
  return ids.flatMap((id) => extractChecklist(requireDoc(repo, id)));
}

export interface DetailedChecklistItem {
  id: string;
  docId: string;
  text: string;
  severity: string;
  verify?: { type?: string; hint?: string; snippet?: { framework?: string; code?: string }; tools?: string[] };
}

export function getChecklistDetailed(
  repo: ContentRepository,
  ids: string[],
  depth: "checks" | "checks+verify" = "checks",
): DetailedChecklistItem[] {
  const out: DetailedChecklistItem[] = [];
  for (const id of ids) {
    const doc = requireDoc(repo, id);
    const docId = doc.frontMatter.id;
    if (doc.checks && doc.checks.length > 0) {
      for (const check of doc.checks) {
        out.push({
          id: check.id,
          docId,
          text: check.text,
          severity: check.severity,
          verify: depth === "checks+verify" ? check.verify : undefined,
        });
      }
    } else {
      extractChecklist(doc).forEach((item, index) => {
        out.push({
          id: `${docId}.c${index + 1}`,
          docId,
          text: item.text,
          severity: "minor",
        });
      });
    }
  }
  return out;
}

// ---------- M2: section-aware, budgeted doc access ----------

export const SECTION_ORDER = [
  "SUMMARY",
  "MUST",
  "SHOULD",
  "AVOID",
  "DECIDE",
  "STATES",
  "EXAMPLE",
  "FAILURE_MODES",
  "CHECK",
  "SOURCES",
  "RELATED",
] as const;

export type SectionName = (typeof SECTION_ORDER)[number];

const DEFAULT_SECTIONS: SectionName[] = ["SUMMARY", "MUST", "SHOULD", "AVOID", "DECIDE", "CHECK"];

const LEGACY_KEY: Record<SectionName, string> = {
  SUMMARY: "summary",
  MUST: "must",
  SHOULD: "should",
  AVOID: "avoid",
  DECIDE: "decide",
  STATES: "states",
  EXAMPLE: "example",
  FAILURE_MODES: "failure modes",
  CHECK: "check",
  SOURCES: "source notes",
  RELATED: "related documents",
};

const TRIM_PRIORITY: Record<SectionName, number> = {
  SOURCES: 1,
  RELATED: 2,
  EXAMPLE: 3,
  FAILURE_MODES: 4,
  STATES: 5,
  SHOULD: 6,
  DECIDE: 7,
  AVOID: 8,
  MUST: 9,
  CHECK: 9,
  SUMMARY: 9,
};

function renderSection(doc: Doc, name: SectionName): string {
  const key = LEGACY_KEY[name];
  const raw = doc.sections?.[key] ?? "";
  if (!raw.trim()) return "";
  const heading = `## ${name === "FAILURE_MODES" ? "FAILURE MODES" : name === "SOURCES" ? "SOURCE NOTES" : name === "RELATED" ? "RELATED DOCUMENTS" : name}`;
  // For sources/related, raw already contains heading? legacy sections keys map to content after heading.
  return `${heading}\n${raw}`.trim();
}

export interface GetDocOptions {
  sections?: string[];
  includeSources?: boolean;
  ifNoneMatch?: string;
  maxTokens?: number;
}

export interface GetDocResult {
  id: string;
  etag: string;
  rev: number;
  notModified: boolean;
  markdown?: string;
  sections: string[];
  deferred: string[];
  truncated: boolean;
  estimatedTokens: number;
}

export function getDocContent(repo: ContentRepository, id: string, options: GetDocOptions = {}): GetDocResult {
  const doc = requireDoc(repo, id);
  const etag = doc.etag ?? `sha256:${id}`;
  const rev = doc.frontMatter.rev;

  if (options.ifNoneMatch && options.ifNoneMatch === etag) {
    return {
      id: doc.frontMatter.id,
      etag,
      rev,
      notModified: true,
      sections: [],
      deferred: [],
      truncated: false,
      estimatedTokens: 20,
    };
  }

  let requested = (options.sections && options.sections.length > 0
    ? options.sections.map((s) => s.toUpperCase())
    : [...DEFAULT_SECTIONS]) as string[];

  if (options.includeSources) {
    if (!requested.includes("SOURCES")) requested.push("SOURCES");
    if (!requested.includes("RELATED")) requested.push("RELATED");
  }

  // canonical order
  const ordered = SECTION_ORDER.filter((s) => requested.includes(s)) as SectionName[];

  const maxTokens = options.maxTokens ?? 4000;

  const items = ordered.map((name) => ({
    name,
    text: renderSection(doc, name),
    cost: estimateTokens(renderSection(doc, name)),
    priority: TRIM_PRIORITY[name],
  }));

  const included = new Set<SectionName>(ordered);
  const deferred: string[] = [];
  let total = estimateTokens(`# ${doc.frontMatter.id} — ${doc.frontMatter.title}`) +
    items.reduce((t, i) => t + i.cost, 0) + (ordered.length > 0 ? ordered.length : 0);

  // trim lowest priority first
  const droppable = items
    .filter((i) => i.priority < 9)
    .sort((a, b) => a.priority - b.priority);

  for (const item of droppable) {
    if (total <= maxTokens) break;
    if (!included.has(item.name as SectionName)) continue;
    included.delete(item.name as SectionName);
    total -= item.cost;
    deferred.push(item.name);
  }

  const truncated = total > maxTokens;

  const includedOrdered = SECTION_ORDER.filter((s) => included.has(s as SectionName)) as SectionName[];
  const markdownParts: string[] = [`# ${doc.frontMatter.id} — ${doc.frontMatter.title}`, ""];
  for (const name of includedOrdered) {
    const text = renderSection(doc, name);
    if (text.trim()) markdownParts.push(text, "");
  }
  const markdown = markdownParts.join("\n").trim() + "\n";

  const estimatedTokens = Math.min(total, maxTokens) || 20;

  return {
    id: doc.frontMatter.id,
    etag,
    rev,
    notModified: false,
    markdown,
    sections: includedOrdered,
    deferred,
    truncated,
    estimatedTokens: truncated ? maxTokens : estimatedTokens,
  };
}

export interface GetDocsOptions {
  sections?: string[];
  includeSources?: boolean;
  maxTokens?: number;
}

export interface GetDocsResult {
  docs: GetDocResult[];
  deferred: { id: string; estimatedTokens: number }[];
  estimatedTokens: number;
  truncated: boolean;
}

export function getDocs(repo: ContentRepository, ids: string[], options: GetDocsOptions = {}): GetDocsResult {
  const maxTokens = options.maxTokens ?? 2500;
  const docs: GetDocResult[] = [];
  const deferred: { id: string; estimatedTokens: number }[] = [];
  let used = 0;

  for (const id of ids) {
    const content = getDocContent(repo, id, {
      sections: options.sections,
      includeSources: options.includeSources,
      maxTokens: Number.POSITIVE_INFINITY,
    });
    const cost = content.estimatedTokens || 20;
    if (docs.length === 0 || used + cost <= maxTokens) {
      docs.push(content);
      used += cost;
    } else {
      deferred.push({ id, estimatedTokens: cost });
    }
  }

  return {
    docs,
    deferred,
    estimatedTokens: used,
    truncated: deferred.length > 0,
  };
}
