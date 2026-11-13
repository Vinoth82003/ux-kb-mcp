export interface LintIssue {
  level: "error" | "warning";
  code: string;
  message: string;
  /** File path for doc issues; logical name (pack/routing/release) otherwise. */
  path: string;
}

export interface LintReport {
  docs: number;
  errors: number;
  warnings: number;
  issues: LintIssue[];
}
