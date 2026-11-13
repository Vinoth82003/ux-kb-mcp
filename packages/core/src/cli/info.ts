#!/usr/bin/env node
/**
 * Catalog inspector: stats, pack budgets, search and doc previews.
 *
 *   ux-kb-info
 *   ux-kb-info pack proposal "pricing page"
 *   ux-kb-info search "loading state"
 *   ux-kb-info doc CMP-001
 */
import { createKb } from "../kb";
import { formatTokens } from "../content/tokens";

function stats(): void {
  const kb = createKb();
  const release = kb.release();
  const docs = kb.docs();

  console.log(`UX-KB ${release.version} — ${release.docCount} docs, ${release.packCount} packs, ${release.routeCount} routes`);
  console.log(`content: ${kb.repo.contentDir}\n`);

  const byDomain = new Map<string, number>();
  for (const doc of docs) {
    byDomain.set(doc.frontMatter.domain, (byDomain.get(doc.frontMatter.domain) ?? 0) + 1);
  }
  console.log("Docs per domain:");
  for (const [domain, count] of [...byDomain].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${domain.padEnd(18)} ${count}`);
  }

  console.log("\nStage packs (estimate, base docs only):");
  for (const stage of kb.repo.packs().keys()) {
    const pack = kb.pack(stage);
    const docsTokens = [...pack.baseDocs, ...pack.routedDocs].reduce(
      (total, doc) => total + doc.tokenEstimate,
      0,
    );
    const coreTokens = pack.tokenEstimate - docsTokens;
    console.log(
      `  ${stage.padEnd(12)} docs ${String(pack.baseDocs.length).padStart(2)}  ` +
        `~${formatTokens(pack.tokenEstimate)} / ${formatTokens(pack.budgetTokens)} tokens` +
        `  (core ~${formatTokens(coreTokens)})`,
    );
  }

  const largest = [...docs].sort((a, b) => b.tokenEstimate - a.tokenEstimate).slice(0, 5);
  console.log("\nLargest docs:");
  for (const doc of largest) {
    console.log(`  ${doc.frontMatter.id}  ~${formatTokens(doc.tokenEstimate)} tokens  ${doc.frontMatter.title}`);
  }
}

function showPack(stage: string, feature?: string): void {
  const kb = createKb();
  const pack = kb.pack(stage, feature);
  console.log(
    `${stage}: ${pack.baseDocs.length} base + ${pack.routedDocs.length} routed, ` +
      `~${formatTokens(pack.tokenEstimate)} / ${formatTokens(pack.budgetTokens)} tokens` +
      `${pack.overBudget ? " OVER BUDGET" : ""}`,
  );
  if (pack.routedIds.length) console.log(`routed: ${pack.routedIds.join(", ")}`);
  for (const doc of [...pack.baseDocs, ...pack.routedDocs]) {
    console.log(
      `  ${doc.frontMatter.id}  ~${String(doc.tokenEstimate).padStart(4)}  ${doc.frontMatter.title}`,
    );
  }
}

function search(query: string): void {
  const kb = createKb();
  const hits = kb.search(query, { limit: 10 });
  console.log(`${hits.length} result(s) for "${query}"`);
  for (const hit of hits) {
    console.log(`  ${hit.id}  ${String(hit.score).padStart(4)}  ${hit.title}`);
    console.log(`        ${hit.summary}`);
  }
}

function showDoc(id: string): void {
  const kb = createKb();
  const doc = kb.requireDoc(id);
  const fm = doc.frontMatter;
  console.log(
    `${fm.id} — ${fm.title}\nstatus: ${fm.status} | rev: ${fm.rev} | domain: ${fm.domain} | ~${doc.tokenEstimate} tokens`,
  );
  console.log(`tags: ${fm.tags.join(", ")}`);
  console.log(`stages: ${fm.stages.join(", ")} | related: ${fm.related.join(", ")}`);
  console.log(`\n${doc.body}`);
}

function main(): void {
  const [command, ...rest] = process.argv.slice(2);
  switch (command) {
    case undefined:
    case "stats":
      stats();
      break;
    case "pack":
      if (!rest[0]) throw new Error("Usage: ux-kb-info pack <stage> [feature]");
      showPack(rest[0], rest.slice(1).join(" ") || undefined);
      break;
    case "search":
      if (!rest.length) throw new Error("Usage: ux-kb-info search <query>");
      search(rest.join(" "));
      break;
    case "doc":
      if (!rest[0]) throw new Error("Usage: ux-kb-info doc <ID>");
      showDoc(rest[0]);
      break;
    default:
      throw new Error(`Unknown command "${command}". Use stats | pack | search | doc.`);
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
