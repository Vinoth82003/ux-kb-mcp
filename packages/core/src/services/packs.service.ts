import type { PackResult } from "../schemas/pack";
import type { Doc } from "../schemas/doc";
import { isStage } from "../schemas/doc";
import type { ContentRepository } from "../content/repository";
import { estimateTokens } from "../content/tokens";
import { KbError } from "../errors";
import { requireDoc } from "./docs.service";

export type PackDepth = "checklist" | "rules" | "full";

export interface GetStagePackOptions {
  depth?: PackDepth;
  maxTokens?: number;
  page?: number;
  deliveredIds?: string[];
}

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

function depthSections(depth: PackDepth): string[] {
  if (depth === "checklist") return ["CHECK"];
  if (depth === "rules") return ["SUMMARY", "MUST", "CHECK"];
  return ["SUMMARY", "MUST", "SHOULD", "AVOID", "DECIDE", "STATES", "EXAMPLE", "FAILURE_MODES", "CHECK", "SOURCES", "RELATED"];
}

function renderDocForDepth(doc: Doc, depth: PackDepth): string {
  // Use legacy sections record; build a small markdown slice.
  const legacy = doc.sections ?? {};
  const pick = (key: string) => legacy[key] ?? "";
  if (depth === "checklist") {
    return pick("check");
  }
  if (depth === "rules") {
    return [pick("summary"), pick("must"), pick("check")].filter(Boolean).join("\n\n");
  }
  return doc.body ?? "";
}

export function getStagePack(
  repo: ContentRepository,
  stage: string,
  feature?: string,
  options: GetStagePackOptions = {},
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

  const depth: PackDepth = options.depth ?? "rules";
  const maxTokens = options.maxTokens ?? pack.budget_tokens;
  const page = Math.max(1, options.page ?? 1);
  const delivered = new Set(options.deliveredIds ?? []);

  const baseIds = [...pack.always];
  const routedIdsRaw = feature ? routeFeature(repo, feature) : [];
  const routedIds = routedIdsRaw.filter((id) => !baseIds.includes(id));

  const allIds = [...baseIds, ...routedIds];
  const baseIdSet = new Set(baseIds);

  // per-doc cost
  const items = allIds.map((id) => {
    const doc = requireDoc(repo, id);
    const unchanged = delivered.has(id);
    const cost = unchanged ? 20 : estimateTokens(renderDocForDepth(doc, depth));
    return { id, doc, unchanged, cost, routed: !baseIdSet.has(id) };
  });

  const includeCore = pack.include_core_md;
  const coreRules = includeCore && (depth === "rules" || depth === "full") ? repo.core() : undefined;
  const antiSlop = includeCore && (depth === "rules" || depth === "full") ? repo.antiSlop() : undefined;
  const coreCost = (coreRules ? estimateTokens(coreRules) : 0) + (antiSlop ? estimateTokens(antiSlop) : 0);

  // paginate
  const pages: (typeof items)[] = [[]];
  let currentCost = coreCost;
  for (const item of items) {
    if (pages[pages.length - 1].length > 0 && currentCost + item.cost > maxTokens) {
      pages.push([]);
      currentCost = coreCost;
    }
    pages[pages.length - 1].push(item);
    currentCost += item.cost;
  }
  const totalPages = Math.max(1, pages.length);
  const safePage = Math.min(page, totalPages);
  const selected = pages[safePage - 1] ?? [];

  const selectedIds = new Set(selected.map((i) => i.id));
  const deferredIds = allIds.filter((id) => !selectedIds.has(id));

  const selectedBaseDocs: Doc[] = [];
  const selectedRoutedDocs: Doc[] = [];
  const unchangedIds: string[] = [];
  for (const item of selected) {
    if (item.unchanged) {
      unchangedIds.push(item.id);
      continue;
    }
    if (item.routed) selectedRoutedDocs.push(item.doc);
    else selectedBaseDocs.push(item.doc);
  }

  const tokenEstimate =
    coreCost + selected.reduce((t, i) => t + i.cost, 0);

  return {
    stage,
    kbVersion: repo.release().version,
    budgetTokens: pack.budget_tokens,
    includeCore: pack.include_core_md,
    coreRules,
    antiSlop,
    baseDocs: selectedBaseDocs,
    routedDocs: selectedRoutedDocs,
    routedIds: routedIds.filter((id) => selectedIds.has(id)),
    tokenEstimate,
    overBudget: tokenEstimate > maxTokens,
    depth,
    maxTokens,
    page: safePage,
    totalPages,
    deferredIds,
    unchangedIds,
    allIds,
    baseIds,
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
