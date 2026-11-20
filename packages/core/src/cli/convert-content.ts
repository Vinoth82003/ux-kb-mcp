import { readFileSync, writeFileSync } from "node:fs";
import { resolveContentDir, contentPaths } from "../content/paths";
import { walkMarkdown } from "../content/repository";
import { convertMarkdownToJson } from "../content/convert";

const dir = resolveContentDir();
const docsDir = contentPaths.docs(dir);
const files = walkMarkdown(docsDir).filter((f) => f.endsWith(".md"));

let count = 0;
for (const file of files) {
  const raw = readFileSync(file, "utf8");
  const json = convertMarkdownToJson(raw, file);
  const out = file.replace(/\.md$/, ".json");
  writeFileSync(out, JSON.stringify(json, null, 2) + "\n", "utf8");
  count += 1;
}
console.log(`Converted ${count} docs to JSON in ${docsDir}`);