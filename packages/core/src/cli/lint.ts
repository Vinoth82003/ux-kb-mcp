#!/usr/bin/env node
import { relative } from "node:path";
import { ContentRepository } from "../content/repository";
import { resolveContentDir, resolveRepoRoot } from "../content/paths";
import { DEFAULT_LINT_OPTIONS, lintCatalog } from "../lint/doc-linter";

interface Args {
  json: boolean;
  maxWarnings: number;
  contentDir?: string;
  warnTokens: number;
  maxTokens: number;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    json: false,
    maxWarnings: Number.POSITIVE_INFINITY,
    warnTokens: DEFAULT_LINT_OPTIONS.warnTokens,
    maxTokens: DEFAULT_LINT_OPTIONS.maxTokens,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`Missing value for ${arg}`);
      i += 1;
      return value;
    };

    switch (arg) {
      case "--json":
        args.json = true;
        break;
      case "--max-warnings":
        args.maxWarnings = Number(next());
        break;
      case "--content":
        args.contentDir = next();
        break;
      case "--warn-tokens":
        args.warnTokens = Number(next());
        break;
      case "--max-tokens":
        args.maxTokens = Number(next());
        break;
      case "--help":
      case "-h":
        console.log(
          [
            "Usage: ux-kb-lint [options]",
            "",
            "  --json                Machine-readable report",
            "  --max-warnings <n>    Fail when warnings exceed n (default: never)",
            "  --content <dir>       Content directory (default: auto-detected)",
            "  --warn-tokens <n>     Per-doc token warning threshold (default 800)",
            "  --max-tokens <n>      Per-doc token hard limit (default 1200)",
          ].join("\n"),
        );
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function main(): void {
  let args: Args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
    return;
  }

  const contentDir = args.contentDir ?? resolveContentDir();
  const root = resolveRepoRoot(contentDir);
  const repo = new ContentRepository({ contentDir, strict: false });
  const report = lintCatalog(repo, {
    warnTokens: args.warnTokens,
    maxTokens: args.maxTokens,
  });

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const release = repo.release();
    console.log(`UX-KB lint — ${report.docs} docs, release ${release.version}`);
    if (report.issues.length === 0) {
      console.log("No issues.");
    }
    for (const item of report.issues) {
      const location = item.path.startsWith("pack:") || item.path.startsWith("routing:")
        ? item.path
        : relative(root, item.path);
      const tag = item.level === "error" ? "ERROR" : "WARN ";
      console.log(`${tag} ${item.code}  ${location}\n      ${item.message}`);
    }
    console.log(`\n${report.errors} error(s), ${report.warnings} warning(s)`);
  }

  const failed = report.errors > 0 || report.warnings > args.maxWarnings;
  process.exit(failed ? 1 : 0);
}

main();
