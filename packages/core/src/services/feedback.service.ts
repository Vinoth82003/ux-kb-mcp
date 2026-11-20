import type { KbStore, GateRecord } from "../store/types";
import type { ContentRepository } from "../content/repository";
import { KbError } from "../errors";

// ---------- report_false_positive ----------

interface FalsePositiveReport {
  ticketId: string;
  itemId: string;
  at: string;
}

const falsePositiveReports: FalsePositiveReport[] = [];
let fpCounter = 0;

export interface ReportFalsePositiveInput {
  itemId: string;
  reason: string;
  context?: string;
  sessionId?: string;
}

export interface ReportFalsePositiveResult {
  ticketId: string;
  itemId: string;
  noiseScore: number;
  status: "open";
}

export async function reportFalsePositive(
  store: KbStore,
  input: ReportFalsePositiveInput,
): Promise<ReportFalsePositiveResult> {
  const itemId = input.itemId.trim();
  if (!itemId) throw new KbError("INVALID_INPUT", "itemId is required.");
  if (!input.reason || input.reason.trim().length < 5) {
    throw new KbError("INVALID_INPUT", "reason must be at least 5 characters.");
  }
  // Telemetry stores item IDs/counts only — reason/context are not persisted.
  fpCounter += 1;
  const ticketId = `FP-${String(fpCounter).padStart(4, "0")}`;
  falsePositiveReports.push({ ticketId, itemId, at: new Date().toISOString() });
  const count = falsePositiveReports.filter((r) => r.itemId === itemId).length;
  return { ticketId, itemId, noiseScore: count, status: "open" };
}

// ---------- top_failures ----------

export interface TopFailureEntry {
  itemId: string;
  failures: number;
  total: number;
  failRate: number;
}

export interface TopFailuresOptions {
  domain?: string;
  limit?: number;
  window?: "7d" | "30d" | "90d";
}

const WINDOW_MS: Record<string, number> = {
  "7d": 7 * 86_400_000,
  "30d": 30 * 86_400_000,
  "90d": 90 * 86_400_000,
};

export async function topFailures(
  store: KbStore,
  repo: ContentRepository | undefined,
  options: TopFailuresOptions = {},
): Promise<TopFailureEntry[]> {
  const limit = Math.min(Math.max(options.limit ?? 10, 1), 50);
  const windowMs = WINDOW_MS[options.window ?? "30d"] ?? WINDOW_MS["30d"];
  const cutoff = Date.now() - windowMs;

  const gates: GateRecord[] = await store.listGates();
  const stats = new Map<string, { failures: number; total: number }>();

  for (const gate of gates) {
    if (new Date(gate.createdAt).getTime() < cutoff) continue;
    for (const item of gate.items) {
      const result = gate.results[item.id];
      if (!result) continue;
      const entry = stats.get(item.id) ?? { failures: 0, total: 0 };
      entry.total += 1;
      if (result.result === "fail") entry.failures += 1;
      stats.set(item.id, entry);
    }
  }

  // false-positive noise is folded into the score as extra failures.
  for (const report of falsePositiveReports) {
    if (new Date(report.at).getTime() < cutoff) continue;
    const entry = stats.get(report.itemId) ?? { failures: 0, total: 0 };
    entry.failures += 1;
    stats.set(report.itemId, entry);
  }

  let entries: TopFailureEntry[] = [...stats.entries()]
    .filter(([, v]) => v.failures > 0)
    .map(([itemId, v]) => ({
      itemId,
      failures: v.failures,
      total: v.total || v.failures,
      failRate: v.total > 0 ? v.failures / v.total : 1,
    }));

  if (options.domain && repo) {
    entries = entries.filter((e) => {
      const baseId = e.itemId.split(".")[0] ?? e.itemId;
      const doc = repo.doc(baseId);
      return doc?.frontMatter.domain === options.domain;
    });
  }

  entries.sort((a, b) => b.failures - a.failures || b.failRate - a.failRate);
  return entries.slice(0, limit);
}

// ---------- diff_since ----------

export interface DiffSinceInput {
  sessionId: string;
  sinceVersion: string;
  ids: string[];
}

export interface DiffDocEntry {
  id: string;
  rev: number;
  etag: string;
  changed: boolean;
  checks: { id: string; text: string; severity: string }[];
}

export interface DiffSinceResult {
  fromVersion: string;
  toVersion: string;
  changed: boolean;
  docs: DiffDocEntry[];
}

export function diffSince(
  repo: ContentRepository,
  input: DiffSinceInput,
): DiffSinceResult {
  const toVersion = repo.release().version;
  const changed = input.sinceVersion.trim() !== toVersion;
  const ids = [...new Set(input.ids.map((id) => id.trim().toUpperCase()).filter(Boolean))];
  if (ids.length === 0) throw new KbError("INVALID_INPUT", "ids must contain at least one document ID.");

  const docs: DiffDocEntry[] = [];
  for (const id of ids) {
    const doc = repo.doc(id);
    if (!doc) throw new KbError("DOC_NOT_FOUND", `Unknown document ID "${id}".`);
    const versioned = repo.versionedDoc(id);
    docs.push({
      id: doc.frontMatter.id,
      rev: doc.frontMatter.rev,
      etag: doc.etag ?? "",
      changed,
      checks: (versioned?.checks ?? []).map((c) => ({
        id: c.id,
        text: c.text,
        severity: c.severity,
      })),
    });
  }

  return { fromVersion: input.sinceVersion, toVersion, changed, docs };
}
