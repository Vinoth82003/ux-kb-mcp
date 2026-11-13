import { basename } from "node:path";
import type { Doc, RuleRef } from "../schemas/doc";
import { DOMAIN_PREFIX } from "../schemas/doc";
import type { LintIssue, LintReport } from "../schemas/lint";
import type { ContentRepository } from "../content/repository";
import { estimateTokens } from "../content/tokens";
import { extractChecklist, extractRules } from "../content/parser";

export interface LintOptions {
  warnTokens: number;
  maxTokens: number;
}

export const DEFAULT_LINT_OPTIONS: LintOptions = { warnTokens: 800, maxTokens: 1200 };

const REQUIRED_SECTIONS: Array<{ key: string; label: string }> = [
  { key: "must", label: "MUST" },
  { key: "check", label: "CHECK" },
];

function issue(
  level: LintIssue["level"],
  code: string,
  message: string,
  path: string,
): LintIssue {
  return { level, code, message, path };
}

function lintRuleSequence(rules: RuleRef[], doc: Doc, path: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const expectedPrefix = `${doc.frontMatter.id}.`;

  const seen = new Set<string>();
  for (const rule of rules) {
    if (seen.has(rule.id)) {
      issues.push(issue("error", "RULE001", `Duplicate rule ID ${rule.id}`, path));
    }
    seen.add(rule.id);
    if (!rule.id.startsWith(expectedPrefix)) {
      issues.push(
        issue(
          "error",
          "RULE003",
          `Rule ${rule.id} does not belong to ${doc.frontMatter.id}`,
          path,
        ),
      );
    }
  }

  for (const kind of ["M", "S", "A"] as const) {
    const numbers = rules
      .filter((rule) => rule.kind === kind)
      .map((rule) => rule.number)
      .sort((a, b) => a - b);
    numbers.forEach((number, index) => {
      if (number !== index + 1) {
        issues.push(
          issue(
            "warning",
            "RULE002",
            `Rule numbering for .${kind} is not sequential: expected ${index + 1}, found ${number}`,
            path,
          ),
        );
      }
    });
  }

  return issues;
}

export function lintDoc(
  doc: Doc,
  allIds: Set<string>,
  options: LintOptions = DEFAULT_LINT_OPTIONS,
): LintIssue[] {
  const path = doc.path || doc.frontMatter.id;
  const fm = doc.frontMatter;
  const issues: LintIssue[] = [];

  if (doc.path) {
    const file = basename(doc.path);
    if (!file.startsWith(`${fm.id}-`)) {
      issues.push(
        issue("error", "ID001", `File name must start with "${fm.id}-" (found ${file})`, path),
      );
    }
  }

  const prefix = fm.id.split("-")[0];
  const expectedPrefix = DOMAIN_PREFIX[fm.domain];
  if (prefix !== expectedPrefix) {
    issues.push(
      issue(
        "error",
        "ID002",
        `ID prefix "${prefix}" does not match domain "${fm.domain}" (expected ${expectedPrefix})`,
        path,
      ),
    );
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!doc.sections[section.key]?.trim()) {
      issues.push(issue("error", "SEC001", `Missing required ${section.label} section`, path));
    }
  }

  if (!doc.summary) {
    issues.push(issue("warning", "SEC002", "Missing Summary section", path));
  }

  const rules = extractRules(doc);
  issues.push(...lintRuleSequence(rules, doc, path));

  for (const related of fm.related) {
    if (related === fm.id) {
      issues.push(issue("error", "REL002", `Document links to itself (${related})`, path));
    } else if (!allIds.has(related)) {
      issues.push(
        issue("error", "REL001", `Related ID ${related} does not exist in the catalog`, path),
      );
    }
  }

  if (fm.sources.length === 0) {
    issues.push(issue("warning", "SRC001", "No sources listed", path));
  }

  const checkItems = extractChecklist(doc);
  if (doc.sections.check && checkItems.length === 0) {
    issues.push(
      issue("warning", "CHK001", "CHECK section has no checkbox items (- [ ] ...)", path),
    );
  }

  const tokens = estimateTokens(doc.body) + estimateTokens(fm.title);
  if (tokens > options.maxTokens) {
    issues.push(
      issue(
        "error",
        "TOK002",
        `Token estimate ${tokens} exceeds the hard limit of ${options.maxTokens}`,
        path,
      ),
    );
  } else if (tokens > options.warnTokens) {
    issues.push(
      issue(
        "warning",
        "TOK001",
        `Token estimate ${tokens} exceeds the ${options.warnTokens}-token target`,
        path,
      ),
    );
  }

  return issues;
}

export function lintCatalog(
  repo: ContentRepository,
  options: LintOptions = DEFAULT_LINT_OPTIONS,
): LintReport {
  const docs = repo.docs();
  const allIds = new Set(docs.map((doc) => doc.frontMatter.id));
  const issues: LintIssue[] = [...repo.loadErrors()];

  for (const doc of docs) {
    issues.push(...lintDoc(doc, allIds, options));
  }

  for (const [stage, pack] of repo.packs()) {
    const path = `pack:${stage}`;
    for (const id of pack.always) {
      if (!allIds.has(id)) {
        issues.push(issue("error", "PACK002", `Pack ${stage} references unknown doc ${id}`, path));
      }
    }
    const docTokens = pack.always.reduce((total, id) => {
      const doc = docs.find((candidate) => candidate.frontMatter.id === id);
      return total + (doc ? estimateTokens(doc.body) + estimateTokens(doc.frontMatter.title) : 0);
    }, 0);
    const coreTokens = pack.include_core_md
      ? estimateTokens(repo.core()) + estimateTokens(repo.antiSlop())
      : 0;
    const tokens = docTokens + coreTokens;
    if (tokens > pack.budget_tokens) {
      issues.push(
        issue(
          "warning",
          "PACK003",
          `Pack ${stage} is ~${tokens} tokens (docs ~${docTokens} + core ~${coreTokens}), over its ${pack.budget_tokens} budget`,
          path,
        ),
      );
    }
  }

  for (const route of repo.routes()) {
    for (const id of route.add) {
      if (!allIds.has(id)) {
        issues.push(
          issue(
            "error",
            "ROUTE003",
            `Route [${route.match.join(", ")}] references unknown doc ${id}`,
            "routing:feature-routes",
          ),
        );
      }
    }
  }

  const errors = issues.filter((entry) => entry.level === "error").length;
  const warnings = issues.filter((entry) => entry.level === "warning").length;

  return {
    docs: docs.length,
    errors,
    warnings,
    issues: issues.sort(
      (a, b) => a.path.localeCompare(b.path) || a.code.localeCompare(b.code),
    ),
  };
}
