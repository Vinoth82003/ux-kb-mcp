import { z } from "zod";
import { APPLIES_TO, DOMAINS, DOC_STATUSES, docIdSchema, tagSchema } from "./doc";

export const severitySchema = z.enum(["blocker", "major", "minor"]);
export type Severity = z.infer<typeof severitySchema>;

export const verifySchema = z.object({
  type: z.string().optional(),
  hint: z.string().optional(),
  snippet: z
    .object({
      framework: z.string().optional(),
      code: z.string().optional(),
    })
    .optional(),
  snippets: z
    .array(
      z.object({
        framework: z.string().optional(),
        code: z.string().optional(),
      }),
    )
    .optional(),
  tools: z.array(z.string()).default([]),
  manual: z.string().optional(),
});

export const checkItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  severity: severitySchema.default("minor"),
  wcag: z.array(z.string()).default([]),
  verify: verifySchema.optional(),
  naForbidden: z.boolean().default(false),
});

export const sourceV2Schema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  relation: z.string().default("authoritative"),
});

export const relatedV2Schema = z.object({
  id: z.string().min(1),
  when: z.string().default(""),
});

export const tokenCostSchema = z.object({
  full: z.number().int().nonnegative(),
  rules: z.number().int().nonnegative(),
  checks: z.number().int().nonnegative(),
});

export const sectionRuleSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const decideItemSchema = z.object({
  situation: z.string().min(1),
  decision: z.string().min(1),
});

export const exampleSchema = z.object({
  good: z.string().default(""),
  bad: z.string().default(""),
});

export const structuredSectionsSchema = z.object({
  MUST: z.array(sectionRuleSchema).default([]),
  SHOULD: z.array(sectionRuleSchema).default([]),
  AVOID: z.array(sectionRuleSchema).default([]),
  DECIDE: z.array(decideItemSchema).default([]),
  STATES: z.array(z.string()).default([]),
  EXAMPLE: exampleSchema.optional(),
  FAILURE_MODES: z.array(z.string()).default([]),
  CHECK: z.array(z.string()).default([]),
});

export const docSchema = z.object({
  id: docIdSchema,
  title: z.string().min(1),
  rev: z.number().int().positive(),
  etag: z.string().min(1),
  status: z.enum(DOC_STATUSES),
  domain: z.enum(DOMAINS),
  tags: z.array(tagSchema).default([]),
  appliesTo: z.array(z.enum(APPLIES_TO)).default([]),
  summary: z.string().default(""),
  sections: structuredSectionsSchema,
  checks: z.array(checkItemSchema).default([]),
  sources: z.array(sourceV2Schema).default([]),
  related: z.array(relatedV2Schema).default([]),
  tokenCost: tokenCostSchema,
});

export type VersionedDoc = z.infer<typeof docSchema>;

// aliases
export const versionedDocSchema = docSchema;
export const docV2Schema = docSchema;
export const documentSchema = docSchema;
