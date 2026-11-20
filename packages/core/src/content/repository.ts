import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import YAML from "yaml";
import { convertMarkdownToJson, renderDocMarkdown } from "./convert";
import type { VersionedDoc } from "../schemas/document";
import {
  packFileSchema,
  releaseFileSchema,
  routeSchema,
  type PackDefinition,
  type ReleaseFile,
  type RouteDefinition,
} from "../schemas/pack";
import type { LintIssue } from "../schemas/lint";
import { docFrontMatterSchema, type Doc } from "../schemas/doc";
import { docSchema } from "../schemas/document";
import { extractSections, parseDoc } from "./parser";
import { contentPaths, resolveContentDir } from "./paths";

export function walkMarkdown(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMarkdown(full));
    else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".json"))) out.push(full);
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

  private versionedCache = new Map<string, VersionedDoc>();

  docs(): Doc[] {
    return this.cached("docs", () => {
      const docs: Doc[] = [];
      const seen = new Map<string, string>();

      const files = walkMarkdown(contentPaths.docs(this.contentDir));
      // Prefer JSON over Markdown for the same basename.
      const jsonBases = new Set(
        files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")),
      );

      for (const file of files) {
        if (file.endsWith(".md") && jsonBases.has(file.replace(/\.md$/, ""))) continue;

        try {
          let doc: Doc;
          let versioned: VersionedDoc | undefined;

          if (file.endsWith(".json")) {
            const parsed = docSchema.parse(JSON.parse(readFileSync(file, "utf8")));
            versioned = parsed;
            this.versionedCache.set(parsed.id, parsed);
            doc = this.jsonToLegacyDoc(parsed, file);
          } else {
            const md = readFileSync(file, "utf8");
            doc = parseDoc(md, file);
            try {
              versioned = convertMarkdownToJson(md, file);
              this.versionedCache.set(versioned.id, versioned);
            } catch {
              versioned = undefined;
            }
          }

          const id = doc.frontMatter.id;
          const previous = seen.get(id);
          if (previous) {
            const message = `Duplicate doc ID ${id} in ${file} (already defined in ${previous})`;
            if (this.strict) throw new Error(message);
            this.errors.push({ level: "error", code: "ID003", message, path: file });
            continue;
          }
          seen.set(id, file);

          if (versioned) {
            doc.id = versioned.id;
            doc.title = versioned.title;
            doc.rev = versioned.rev;
            doc.etag = versioned.etag;
            doc.status = versioned.status;
            doc.tags = versioned.tags;
            doc.appliesTo = versioned.appliesTo;
            doc.structuredSections = versioned.sections;
            doc.checks = versioned.checks;
            doc.sources = versioned.sources;
            doc.related = versioned.related;
            doc.tokenCost = versioned.tokenCost;
            doc.versioned = versioned;
          }

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

  private jsonToLegacyDoc(parsed: VersionedDoc, file: string): Doc {
    const relatedIds = parsed.related.map((r) => r.id);
    const sources = parsed.sources.map((s) => ({ name: s.title, url: s.url }));
    const fm = {
      id: parsed.id,
      title: parsed.title,
      domain: parsed.domain,
      type: "pattern" as const,
      status: parsed.status,
      rev: parsed.rev,
      priority: "standard" as const,
      stages: ["audit", "proposal", "critique", "implement"] as any,
      tags: parsed.tags,
      applies_to: parsed.appliesTo,
      related: relatedIds,
      sources,
      updated: "2026-11-15",
    };
    // validate via schema? docFrontMatterSchema requires group optional, priority enum. Use parse.
    const frontMatter = docFrontMatterSchema.parse(fm);
    const body = renderDocMarkdown(parsed);
    const sections = extractSections(body);
    return {
      frontMatter,
      body,
      sections,
      summary: parsed.summary,
      tokenEstimate: parsed.tokenCost.full,
      path: file,
    };
  }

  versionedDocs(): VersionedDoc[] {
    // ensure loaded
    this.docs();
    return [...this.versionedCache.values()];
  }

  versionedDoc(id: string): VersionedDoc | undefined {
    const normalized = id.trim().toUpperCase();
    this.docs();
    return this.versionedCache.get(normalized);
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
