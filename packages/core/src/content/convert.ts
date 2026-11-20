import { createHash } from "node:crypto";
import YAML from "yaml";
import { extractSections, firstLine, parseDoc, splitFrontMatter } from "./parser";
import { estimateTokens } from "./tokens";
import { docFrontMatterSchema } from "../schemas/doc";
import type { VersionedDoc } from "../schemas/document";
import { docSchema } from "../schemas/document";
import { extractRules } from "./parser";
import type { RuleRef } from "../schemas/doc";
import { sanitizeContent } from "./sanitizer";

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function normalizeFrontMatter(input: unknown): unknown {
  // reuse parser logic by calling parseDoc? We'll duplicate minimal.
  if (typeof input !== "object" || input === null) return input;
  const data: Record<string, unknown> = { ...(input as Record<string, unknown>) };
  if (data.updated instanceof Date) data.updated = data.updated.toISOString().slice(0, 10);
  if (typeof data.rev === "string" && /^\d+$/.test(data.rev)) data.rev = Number(data.rev);
  for (const key of ["stages", "tags", "applies_to", "related", "sources"]) {
    if (data[key] == null) data[key] = [];
  }
  return data;
}

function parseDecide(text: string | undefined): { situation: string; decision: string }[] {
  if (!text) return [];
  const rows: { situation: string; decision: string }[] = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;
    if (/^\|\s*-/.test(trimmed)) continue;
    const cells = trimmed
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 2) continue;
    if (cells[0]?.toLowerCase() === "situation" && cells[1]?.toLowerCase() === "decision") continue;
    if (!cells[0]) continue;
    rows.push({ situation: cells[0], decision: cells[1] ?? "" });
  }
  return rows;
}

function parseExample(text: string | undefined): { good: string; bad: string } | undefined {
  if (!text) return undefined;
  const flat = text.replace(/\r?\n/g, " ").trim();
  const goodMatch = /Good:\s*(.*?)(?:\.\s*Bad:|Bad:|$)/i.exec(flat);
  const badMatch = /Bad:\s*(.*)$/i.exec(flat);
  const good = goodMatch?.[1]?.trim().replace(/\.$/, "") ?? "";
  const bad = (badMatch?.[1]?.trim() ?? "").replace(/\.$/, "");
  if (!good && !bad) return undefined;
  return { good, bad };
}

function parseStates(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*]\s*/, "").trim())
    .filter(Boolean);
}

function parseFailureModes(text: string | undefined): string[] {
  return parseStates(text);
}

function rulesByKind(docId: string, rules: RuleRef[], kind: RuleRef["kind"]): { id: string; text: string }[] {
  return rules
    .filter((r) => r.kind === kind)
    .map((r) => ({ id: r.id, text: r.text }));
}

export function renderDocMarkdown(doc: VersionedDoc): string {
  const parts: string[] = [];
  parts.push(`# ${doc.id} — ${doc.title}`);
  parts.push("");
  parts.push("## Summary");
  parts.push(doc.summary);
  parts.push("");

  const pushRules = (heading: string, items: { id: string; text: string }[]) => {
    if (items.length === 0) return;
    parts.push(`## ${heading}`);
    for (const item of items) parts.push(`- ${item.id}: ${item.text}`);
    parts.push("");
  };

  pushRules("MUST", doc.sections.MUST);
  pushRules("SHOULD", doc.sections.SHOULD);
  pushRules("AVOID", doc.sections.AVOID);

  if (doc.sections.DECIDE.length > 0) {
    parts.push("## DECIDE");
    parts.push("| Situation | Decision |");
    parts.push("|---|---|");
    for (const d of doc.sections.DECIDE) {
      parts.push(`| ${d.situation} | ${d.decision} |`);
    }
    parts.push("");
  }

  if (doc.sections.STATES.length > 0) {
    parts.push("## STATES");
    for (const s of doc.sections.STATES) parts.push(`- ${s}`);
    parts.push("");
  }

  if (doc.sections.EXAMPLE) {
    parts.push("## EXAMPLE");
    parts.push(`Good: ${doc.sections.EXAMPLE.good}. Bad: ${doc.sections.EXAMPLE.bad}.`);
    parts.push("");
  }

  if (doc.sections.FAILURE_MODES.length > 0) {
    parts.push("## FAILURE MODES");
    for (const f of doc.sections.FAILURE_MODES) parts.push(`- ${f}`);
    parts.push("");
  }

  if (doc.checks.length > 0) {
    parts.push("## CHECK");
    for (const c of doc.checks) parts.push(`- [ ] ${c.text}`);
    parts.push("");
  }

  if (doc.sources.length > 0) {
    parts.push("## SOURCE NOTES");
    for (const s of doc.sources) {
      parts.push(`- [${s.title}](${s.url}) — authoritative reference; this document paraphrases relevant guidance.`);
    }
    parts.push("");
  }

  if (doc.related.length > 0) {
    parts.push("## RELATED DOCUMENTS");
    for (const r of doc.related) {
      parts.push(`- \`${r.id}\` — retrieve when the feature crosses into this topic.`);
    }
    parts.push("");
  }

  return sanitizeContent(parts.join("\n").trim()).clean + "\n";
}

export function convertMarkdownToJson(raw: string, filePath = ""): VersionedDoc {
  const { data, content } = splitFrontMatter(raw);
  const fm = docFrontMatterSchema.parse(normalizeFrontMatter(data));
  const body = content.trim();
  const sectionsMd = extractSections(body);
  const rules = extractRules(parseDoc(raw, filePath));

  const must = rulesByKind(fm.id, rules, "M");
  const should = rulesByKind(fm.id, rules, "S");
  const avoid = rulesByKind(fm.id, rules, "A");

  const checksRaw = sectionsMd.check
    ? sectionsMd.check
        .split(/\r?\n/)
        .map((line) => /^\s*[-*]\s+\[[ xX]\]\s+(.+?)\s*$/.exec(line)?.[1]?.trim())
        .filter((v): v is string => Boolean(v))
    : [];

  const checks = checksRaw.map((text, index) => ({
    id: `${fm.id}.c${index + 1}`,
    text,
    severity: "minor" as const,
    wcag: [],
    naForbidden: false,
  }));

  const decide = parseDecide(sectionsMd.decide);
  const states = parseStates(sectionsMd.states);
  const example = parseExample(sectionsMd.example);
  const failureModes = parseFailureModes(sectionsMd["failure modes"] ?? sectionsMd.failure_modes ?? sectionsMd.failuremodes);

  const sources = (fm.sources ?? []).map((s) => ({
    title: s.name,
    url: s.url,
    relation: "authoritative",
  }));

  const related = (fm.related ?? []).map((id) => ({
    id,
    when: "the feature crosses into this topic",
  }));

  const base: VersionedDoc = {
    id: fm.id,
    title: fm.title,
    rev: fm.rev,
    status: fm.status,
    domain: fm.domain,
    tags: fm.tags,
    appliesTo: fm.applies_to,
    summary: firstLine(sectionsMd.summary),
    sections: {
      MUST: must,
      SHOULD: should,
      AVOID: avoid,
      DECIDE: decide,
      STATES: states,
      EXAMPLE: example,
      FAILURE_MODES: failureModes,
      CHECK: [],
    },
    checks,
    sources,
    related,
    etag: "",
    tokenCost: { full: 0, rules: 0, checks: 0 },
  };

  // render to compute token costs
  const fullMd = renderDocMarkdown({ ...base, etag: "", tokenCost: { full: 0, rules: 0, checks: 0 } });
  const rulesMd = [
    `# ${base.id} — ${base.title}`,
    "",
    "## Summary",
    base.summary,
    "",
    "## MUST",
    ...base.sections.MUST.map((r) => `- ${r.id}: ${r.text}`),
    "",
    "## CHECK",
    ...base.checks.map((c) => `- [ ] ${c.text}`),
    "",
  ].join("\n");
  const checksMd = base.checks.map((c) => `- [ ] ${c.text}`).join("\n");

  const tokenCost = {
    full: estimateTokens(fullMd),
    rules: estimateTokens(rulesMd),
    checks: estimateTokens(checksMd),
  };

  const withCost: VersionedDoc = {
    ...base,
    tokenCost,
    etag: "",
  };

  const etag = `sha256:${sha256(JSON.stringify(withCost, Object.keys(withCost).sort()))}`;
  withCost.etag = etag;

  // validate
  return docSchema.parse(withCost);
}

export function parseVersionedDoc(raw: string, filePath = ""): VersionedDoc {
  return convertMarkdownToJson(raw, filePath);
}

export function markdownToDocJson(raw: string, filePath = ""): VersionedDoc {
  return convertMarkdownToJson(raw, filePath);
}

export function docJsonToMarkdown(doc: VersionedDoc): string {
  return renderDocMarkdown(doc);
}

export function computeEtag(doc: VersionedDoc): string {
  const copy = { ...doc, etag: "" };
  return `sha256:${sha256(JSON.stringify(copy, Object.keys(copy).sort()))}`;
}

// normalizeFrontMatter defined locally above.
