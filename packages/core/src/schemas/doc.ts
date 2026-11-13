import { z } from "zod";

export const DOMAINS = [
  "ux",
  "visual_design",
  "components",
  "interaction",
  "responsive",
  "accessibility",
  "content_writing",
  "saas",
  "design_systems",
  "evaluation",
] as const;

export type Domain = (typeof DOMAINS)[number];

/** Domain -> immutable ID prefix (blueprint section 7.1). */
export const DOMAIN_PREFIX: Record<Domain, string> = {
  ux: "UX",
  visual_design: "VIS",
  components: "CMP",
  interaction: "INT",
  responsive: "RSP",
  accessibility: "A11Y",
  content_writing: "CW",
  saas: "SAAS",
  design_systems: "DS",
  evaluation: "EVAL",
};

export const PREFIX_DOMAIN: Record<string, Domain> = Object.fromEntries(
  Object.entries(DOMAIN_PREFIX).map(([domain, prefix]) => [prefix, domain as Domain]),
);

export const DOC_TYPES = ["principle", "pattern", "checklist", "playbook"] as const;
export const DOC_STATUSES = ["draft", "reviewed", "published", "deprecated"] as const;
export const PRIORITIES = ["core", "standard", "niche"] as const;
export const APPLIES_TO = ["web", "mobile"] as const;

export const STAGES = [
  "need_check",
  "research",
  "audit",
  "proposal",
  "critique",
  "implement",
] as const;

export type Stage = (typeof STAGES)[number];

export const docIdSchema = z
  .string()
  .regex(/^[A-Z][A-Z0-9]*-\d{3}$/, "Expected an ID such as CMP-001");

export const tagSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Tags must be lowercase kebab-case");

export const sourceSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
});

export const docFrontMatterSchema = z.object({
  id: docIdSchema,
  title: z.string().min(1),
  domain: z.enum(DOMAINS),
  group: z
    .string()
    .regex(/^M\d{2}$/, "Group codes look like M03")
    .optional(),
  type: z.enum(DOC_TYPES),
  status: z.enum(DOC_STATUSES),
  rev: z.number().int().positive(),
  priority: z.enum(PRIORITIES),
  stages: z.array(z.enum(STAGES)).min(1),
  tags: z.array(tagSchema).min(1),
  applies_to: z.array(z.enum(APPLIES_TO)).min(1),
  related: z.array(docIdSchema).default([]),
  sources: z.array(sourceSchema).default([]),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
});

export type DocFrontMatter = z.infer<typeof docFrontMatterSchema>;

/** A parsed topic document. `sections` is keyed by lowercased heading text. */
export interface Doc {
  frontMatter: DocFrontMatter;
  /** Markdown body without the front matter block. */
  body: string;
  /** Heading text -> markdown content, e.g. sections.must */
  sections: Record<string, string>;
  /** First non-empty line of the Summary section. */
  summary: string;
  /** Character/4 token estimate for the body plus title. */
  tokenEstimate: number;
  /** Absolute path on disk (empty for DB-sourced docs). */
  path: string;
}

export interface RuleRef {
  /** Full rule ID, e.g. CMP-001.M2 */
  id: string;
  /** M (must) | S (should) | A (avoid) */
  kind: "M" | "S" | "A";
  number: number;
  text: string;
}

export interface ChecklistItem {
  docId: string;
  text: string;
}

export function isStage(value: string): value is Stage {
  return (STAGES as readonly string[]).includes(value);
}
