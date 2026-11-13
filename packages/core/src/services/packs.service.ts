import type { PackResult } from "../schemas/pack";
import type { Doc } from "../schemas/doc";
import { isStage } from "../schemas/doc";
import type { ContentRepository } from "../content/repository";
import { estimateTokens } from "../content/tokens";
import { KbError } from "../errors";
import { requireDoc } from "./docs.service";

/** Case-insensitive keyword routing. A route fires when any match term appears in the feature text. */
export function routeFeature(repo: ContentRepository, feature: string): string[] {
  const text = feature.toLowerCase();
  if (!text.trim()) return [];

  const added: string[] = [];
  for (const route of repo.routes()) {
    const hit = route.match.some((term) => text.includes(term.toLowerCase()));
    if (hit) added.push(...route.add);
  }
  return [...new Set(added)];
}

export function getStagePack(
  repo: ContentRepository,
  stage: string,
  feature?: string,
): PackResult {
  if (!isStage(stage)) {
    throw new KbError(
      "INVALID_STAGE",
      `Unknown stage "${stage}". Valid stages: ${[...repo.packs().keys()].join(", ")}`,
    );
  }

  const pack = repo.packs().get(stage);
  if (!pack) {
    throw new KbError(
      "PACK_NOT_FOUND",
      `No pack defined for stage "${stage}". Available: ${[...repo.packs().keys()].join(", ")}`,
    );
  }

  const baseIds = new Set(pack.always);
  const baseDocs = [...baseIds].map((id) => requireDoc(repo, id));
  const routedIds = (feature ? routeFeature(repo, feature) : []).filter(
    (id) => !baseIds.has(id),
  );
  const routedDocs = routedIds.map((id) => requireDoc(repo, id));

  const docs: Doc[] = [...baseDocs, ...routedDocs];
  const coreRules = pack.include_core_md ? repo.core() : undefined;
  const antiSlop = pack.include_core_md ? repo.antiSlop() : undefined;

  const tokenEstimate =
    (coreRules ? estimateTokens(coreRules) : 0) +
    (antiSlop ? estimateTokens(antiSlop) : 0) +
    docs.reduce((total, doc) => total + doc.tokenEstimate, 0);

  return {
    stage,
    kbVersion: repo.release().version,
    budgetTokens: pack.budget_tokens,
    includeCore: pack.include_core_md,
    coreRules,
    antiSlop,
    baseDocs,
    routedDocs,
    routedIds,
    tokenEstimate,
    overBudget: tokenEstimate > pack.budget_tokens,
  };
}

/** Render a pack as one Markdown payload for an agent. */
export function renderPack(pack: PackResult): string {
  const docs = [...pack.baseDocs, ...pack.routedDocs];
  const parts: string[] = [];

  parts.push(
    [
      `# Stage pack: ${pack.stage} (KB ${pack.kbVersion})`,
      `Documents: ${pack.baseDocs.length} base + ${pack.routedDocs.length} routed = ${docs.length}`,
      `Estimated tokens: ${pack.tokenEstimate} / ${pack.budgetTokens} budget${pack.overBudget ? " — OVER BUDGET" : ""}`,
      pack.routedIds.length > 0
        ? `Routed by feature: ${pack.routedIds.join(", ")}`
        : "No feature routes applied.",
      "",
      "Read every document below before the stage. Fetch more with search_kb + get_doc.",
    ].join("\n"),
  );

  if (pack.coreRules) parts.push(pack.coreRules);
  if (pack.antiSlop) parts.push(pack.antiSlop);
  for (const doc of docs) {
    parts.push(`<!-- doc:${doc.frontMatter.id} rev:${doc.frontMatter.rev} status:${doc.frontMatter.status} -->`);
    parts.push(doc.body);
  }

  return parts.join("\n\n---\n\n");
}
