import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "..", "..", "..", "content");
const dest = resolve(here, "..", "content");

if (!existsSync(src)) {
  console.error("content source not found:", src);
  process.exit(1);
}
if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log("copied content ->", dest);
