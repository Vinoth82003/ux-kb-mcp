import { readFileSync } from "node:fs";
import YAML from "yaml";
import {
  docFrontMatterSchema,
  type ChecklistItem,
  type Doc,
  type DocFrontMatter,
  type RuleRef,
} from "../schemas/doc";
import { estimateTokens } from "./tokens";

const HEADING = /^##\s+(.+?)\s*$/;
const RULE = /([A-Z][A-Z0-9]*-\d{3})\.([MSA])(\d+)\s*:\s*(.+)$/;
const CHECKBOX = /^\s*[-*]\s+\[[ xX]\]\s+(.+?)\s*$/;

/** YAML dates become Date objects; schemas expect ISO date strings. */
function normalizeFrontMatter(input: unknown): unknown {
  if (typeof input !== "object" || input === null) return input;
  const data: Record<string, unknown> = { ...(input as Record<string, unknown>) };

  if (data.updated instanceof Date) {
    data.updated = data.updated.toISOString().slice(0, 10);
  }
  if (typeof data.rev === "string" && /^\d+$/.test(data.rev)) {
    data.rev = Number(data.rev);
  }
  for (const key of ["stages", "tags", "applies_to", "related", "sources"]) {
    if (data[key] == null) data[key] = [];
  }
  return data;
}

/** Split the body on level-2 headings. Repeated headings are concatenated. */
export function extractSections(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  let current: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (!current) return;
    const text = buffer.join("\n").trim();
    sections[current] = sections[current] ? `${sections[current]}\n${text}` : text;
    buffer = [];
  };

  for (const line of body.split(/\r?\n/)) {
    const match = HEADING.exec(line);
    if (match?.[1]) {
      flush();
      current = match[1].trim().toLowerCase();
    } else if (current) {
      buffer.push(line);
    }
  }
  flush();
  return sections;
}

export function firstLine(text: string | undefined): string {
  if (!text) return "";
  const line = text
    .split(/\r?\n/)
    .map((value) => value.trim())
    .find((value) => value.length > 0);
  return line ?? "";
}

export function parseDoc(raw: string, filePath = ""): Doc {
  const { data, content } = splitFrontMatter(raw);
  const frontMatter: DocFrontMatter = docFrontMatterSchema.parse(
    normalizeFrontMatter(data),
  );
  const body = content.trim();
  const sections = extractSections(body);

  return {
    frontMatter,
    body,
    sections,
    summary: firstLine(sections.summary),
    tokenEstimate: estimateTokens(body) + estimateTokens(frontMatter.title),
    path: filePath,
  };
}

/** Split YAML front matter from the Markdown body without a CJS dependency. */
export function splitFrontMatter(raw: string): { data: unknown; content: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw);
  if (!match) return { data: {}, content: raw };
  return {
    data: YAML.parse(match[1] ?? "") ?? {},
    content: raw.slice(match[0].length),
  };
}

export function readDocFile(filePath: string): Doc {
  return parseDoc(readFileSync(filePath, "utf8"), filePath);
}

export function extractRules(doc: Doc): RuleRef[] {
  const rules: RuleRef[] = [];
  for (const section of ["must", "should", "avoid"]) {
    const text = doc.sections[section];
    if (!text) continue;
    for (const line of text.split(/\r?\n/)) {
      const match = RULE.exec(line);
      if (!match) continue;
      const [, id, kind, number, ruleText] = match;
      if (!id || !kind || !number) continue;
      rules.push({
        id: `${id}.${kind}${number}`,
        kind: kind as RuleRef["kind"],
        number: Number(number),
        text: (ruleText ?? "").trim(),
      });
    }
  }
  return rules;
}

export function extractChecklist(doc: Doc): ChecklistItem[] {
  const text = doc.sections.check;
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => CHECKBOX.exec(line)?.[1]?.trim())
    .filter((value): value is string => Boolean(value))
    .map((value) => ({ docId: doc.frontMatter.id, text: value }));
}

export function ruleIdFor(docId: string, kind: RuleRef["kind"], n: number): string {
  return `${docId}.${kind}${n}`;
}
