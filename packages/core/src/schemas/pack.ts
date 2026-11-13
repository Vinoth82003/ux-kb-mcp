import { z } from "zod";
import { docIdSchema, STAGES, type Doc } from "./doc";

export const packFileSchema = z.object({
  stage: z.enum(STAGES),
  budget_tokens: z.number().int().positive().default(6000),
  include_core_md: z.boolean().default(true),
  always: z.array(docIdSchema).default([]),
});

export type PackDefinition = z.infer<typeof packFileSchema>;

export const routeSchema = z.object({
  match: z.array(z.string().min(1)).min(1),
  add: z.array(docIdSchema).min(1),
});

export type RouteDefinition = z.infer<typeof routeSchema>;

export const releaseFileSchema = z.object({
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/, "Expected semver, e.g. 1.4.0"),
  notes: z.string().default(""),
  createdAt: z.string().datetime().default(() => new Date().toISOString()),
  isActive: z.boolean().default(true),
});

export type ReleaseFile = z.infer<typeof releaseFileSchema>;

export interface PackResult {
  stage: string;
  kbVersion: string;
  budgetTokens: number;
  includeCore: boolean;
  coreRules?: string;
  antiSlop?: string;
  /** Base pack docs, in declared order. */
  baseDocs: Doc[];
  /** Extra docs added by feature routing. */
  routedDocs: Doc[];
  /** IDs of routed docs, for traceability. */
  routedIds: string[];
  tokenEstimate: number;
  overBudget: boolean;
}

export interface SearchHit {
  id: string;
  title: string;
  summary: string;
  domain: string;
  tags: string[];
  status: string;
  score: number;
}
