import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import YAML from "yaml";
import {
  packFileSchema,
  releaseFileSchema,
  routeSchema,
  type PackDefinition,
  type ReleaseFile,
  type RouteDefinition,
} from "../schemas/pack";
import type { LintIssue } from "../schemas/lint";
import type { Doc } from "../schemas/doc";
import { parseDoc } from "./parser";
import { contentPaths, resolveContentDir } from "./paths";

function walkMarkdown(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMarkdown(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out.sort((a, b) => a.localeCompare(b));
}

/** Pull the first ```yaml fenced block out of a Markdown file. */
export function extractYamlBlock(markdown: string): string {
  const match = /```ya?ml\r?\n([\s\S]*?)```/.exec(markdown);
  if (!match?.[1]) {
    throw new Error("No ```yaml block found");
  }
  return match[1];
}

export interface RepositoryOptions {
  contentDir?: string;
  /** Throw on invalid documents instead of collecting them (default: true). */
  strict?: boolean;
}

export class ContentRepository {
  readonly contentDir: string;
  private readonly strict: boolean;
  private readonly errors: LintIssue[] = [];
  private cache = new Map<string, unknown>();

  constructor(options: RepositoryOptions = {}) {
    this.contentDir = options.contentDir ?? resolveContentDir();
    this.strict = options.strict ?? true;
  }

  private cached<T>(key: string, load: () => T): T {
    if (this.cache.has(key)) return this.cache.get(key) as T;
    const value = load();
    this.cache.set(key, value);
    return value;
  }

  refresh(): void {
    this.cache.clear();
    this.errors.length = 0;
  }

  loadErrors(): LintIssue[] {
    this.docs();
    return [...this.errors];
  }

  docs(): Doc[] {
    return this.cached("docs", () => {
      const docs: Doc[] = [];
      const seen = new Map<string, string>();

      for (const file of walkMarkdown(contentPaths.docs(this.contentDir))) {
        try {
          const doc = parseDoc(readFileSync(file, "utf8"), file);
          const id = doc.frontMatter.id;
          const previous = seen.get(id);
          if (previous) {
            const message = `Duplicate doc ID ${id} in ${file} (already defined in ${previous})`;
            if (this.strict) throw new Error(message);
            this.errors.push({ level: "error", code: "ID003", message, path: file });
            continue;
          }
          seen.set(id, file);
          docs.push(doc);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (this.strict) {
            throw new Error(`Invalid document ${file}: ${message}`, { cause: error });
          }
          this.errors.push({
            level: "error",
            code: "FM001",
            message: `Invalid document: ${message}`,
            path: file,
          });
        }
      }

      return docs.sort((a, b) => a.frontMatter.id.localeCompare(b.frontMatter.id));
    });
  }

  doc(id: string): Doc | undefined {
    const normalized = id.trim().toUpperCase();
    return this.docs().find((doc) => doc.frontMatter.id === normalized);
  }

  has(id: string): boolean {
    return this.doc(id) !== undefined;
  }

  core(): string {
    return this.cached("core", () => {
      const path = contentPaths.core(this.contentDir);
      if (!existsSync(path)) throw new Error(`Missing core rules file: ${path}`);
      return readFileSync(path, "utf8").trim();
    });
  }

  antiSlop(): string {
    return this.cached("antiSlop", () => {
      const path = contentPaths.antiSlop(this.contentDir);
      if (!existsSync(path)) throw new Error(`Missing anti-slop file: ${path}`);
      return readFileSync(path, "utf8").trim();
    });
  }

  packs(): Map<string, PackDefinition> {
    return this.cached("packs", () => {
      const packs = new Map<string, PackDefinition>();
      const dir = contentPaths.packs(this.contentDir);
      for (const file of walkMarkdown(dir)) {
        try {
          const parsed = packFileSchema.parse(
            YAML.parse(extractYamlBlock(readFileSync(file, "utf8"))),
          );
          packs.set(parsed.stage, parsed);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (this.strict) {
            throw new Error(`Invalid pack ${basename(file)}: ${message}`, { cause: error });
          }
          this.errors.push({
            level: "error",
            code: "PACK001",
            message: `Invalid pack: ${message}`,
            path: file,
          });
        }
      }
      return packs;
    });
  }

  routes(): RouteDefinition[] {
    return this.cached("routes", () => {
      const path = contentPaths.routing(this.contentDir);
      if (!existsSync(path)) {
        if (this.strict) throw new Error(`Missing routing file: ${path}`);
        this.errors.push({
          level: "error",
          code: "ROUTE001",
          message: "Missing routing file",
          path,
        });
        return [];
      }
      try {
        const parsed = YAML.parse(extractYamlBlock(readFileSync(path, "utf8")));
        return routeSchema.array().parse(parsed);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (this.strict) throw new Error(`Invalid routing file: ${message}`, { cause: error });
        this.errors.push({
          level: "error",
          code: "ROUTE002",
          message: `Invalid routing file: ${message}`,
          path,
        });
        return [];
      }
    });
  }

  release(): ReleaseFile {
    return this.cached("release", () => {
      const path = contentPaths.release(this.contentDir);
      if (!existsSync(path)) {
        this.errors.push({
          level: "warning",
          code: "REL001",
          message: "No content/release.json; reporting version 0.0.0-dev",
          path,
        });
        return releaseFileSchema.parse({ version: "0.0.0-dev", notes: "", isActive: true });
      }
      try {
        return releaseFileSchema.parse(JSON.parse(readFileSync(path, "utf8")));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (this.strict) {
          throw new Error(`Invalid release file ${path}: ${message}`, { cause: error });
        }
        this.errors.push({
          level: "error",
          code: "REL002",
          message: `Invalid release file: ${message}`,
          path,
        });
        return releaseFileSchema.parse({ version: "0.0.0-dev" });
      }
    });
  }
}
