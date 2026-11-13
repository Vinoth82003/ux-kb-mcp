import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve the content directory.
 *
 * Order: UX_KB_CONTENT_DIR -> walk up from cwd looking for content/core.md ->
 * path relative to this module (packages/core/src/content -> <repo>/content).
 */
export function resolveContentDir(start: string = process.cwd()): string {
  const fromEnv = process.env.UX_KB_CONTENT_DIR?.trim();
  if (fromEnv) {
    const dir = resolve(fromEnv);
    if (!existsSync(join(dir, "core.md"))) {
      throw new Error(
        `UX_KB_CONTENT_DIR is set to ${dir} but ${join(dir, "core.md")} does not exist.`,
      );
    }
    return dir;
  }

  let dir = resolve(start);
  for (let i = 0; i < 8; i += 1) {
    const candidate = join(dir, "content");
    if (existsSync(join(candidate, "core.md"))) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  // Module-relative fallback works for both src/ (tsx) and dist/ (bundled) runs,
  // including when the process cwd is the user's project rather than the repo.
  let moduleDir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i += 1) {
    const candidate = join(moduleDir, "content");
    if (existsSync(join(candidate, "core.md"))) return candidate;
    const parent = dirname(moduleDir);
    if (parent === moduleDir) break;
    moduleDir = parent;
  }

  throw new Error(
    "Could not locate the UX-KB content directory. Set UX_KB_CONTENT_DIR to the folder containing core.md.",
  );
}

export function resolveRepoRoot(contentDir: string = resolveContentDir()): string {
  return dirname(contentDir);
}

export const contentPaths = {
  docs: (dir: string) => join(dir, "docs"),
  packs: (dir: string) => join(dir, "packs"),
  routing: (dir: string) => join(dir, "routing", "feature-routes.md"),
  core: (dir: string) => join(dir, "core.md"),
  antiSlop: (dir: string) => join(dir, "anti-slop.md"),
  release: (dir: string) => join(dir, "release.json"),
} as const;
