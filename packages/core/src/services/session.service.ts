import type { Doc } from "../schemas/doc";
import type { KbStore, SessionMode, SessionRecord } from "../store/types";
import type { ContentRepository } from "../content/repository";
import { KbError } from "../errors";
import { routeFeature } from "./packs.service";
import { getModePolicy, MODE_BUDGETS } from "./policy.service";

/** Minimal catalog surface needed to verify citations (easy to stub in tests). */
export interface CatalogLookup {
  has(id: string): boolean;
  doc(id: string): Doc | undefined;
}

export type { SessionMode };

export interface StartSessionInput {
  apiKeyId: string;
  kbVersion: string;
  feature: string;
  mode?: SessionMode;
  screen?: string;
  tokenBudget?: number;
  idempotencyKey?: string;
}

export interface StartSessionResult {
  session: SessionRecord;
  mode: SessionMode;
  /** Feature-routed docs worth fetching first. */
  suggestedIds: string[];
  featureTags: string[];
  components: string[];
  nextSteps: string[];
}

const DEFAULT_BUDGET: Record<SessionMode, number> = MODE_BUDGETS;

const COMPONENT_KEYWORDS: Array<[RegExp, string]> = [
  [/\b(button|cta)\b/i, "button"],
  [/\b(input|field|form)\b/i, "input"],
  [/\b(table|grid|data grid)\b/i, "table"],
  [/\b(modal|dialog)\b/i, "modal"],
  [/\b(nav|navigation|menu|sidebar|tabs)\b/i, "navigation"],
  [/\b(card)\b/i, "card"],
  [/\b(tooltip)\b/i, "tooltip"],
  [/\b(notification|alert|toast)\b/i, "notification"],
  [/\b(dropdown|select)\b/i, "dropdown"],
];

export async function startSession(
  store: KbStore,
  repo: ContentRepository,
  input: StartSessionInput,
): Promise<StartSessionResult> {
  const feature = input.feature.trim();
  if (!feature) {
    throw new KbError("INVALID_INPUT", "feature must describe what is being designed.");
  }
  if (feature.length > 2000) {
    throw new KbError("INVALID_INPUT", "feature must be 2000 characters or fewer.");
  }

  const requestedMode: SessionMode = input.mode ?? "full";

  // idempotency
  let session: SessionRecord | null = null;
  if (input.idempotencyKey) {
    session = await store.getSessionByIdempotencyKey(input.apiKeyId, input.idempotencyKey);
  }
  if (!session) {
    session = await store.createSession({
      apiKeyId: input.apiKeyId,
      feature,
      kbVersion: input.kbVersion,
      mode: requestedMode,
      screen: input.screen,
      tokenBudget: input.tokenBudget ?? DEFAULT_BUDGET[requestedMode],
      idempotencyKey: input.idempotencyKey ?? null,
    });
  }
  // A resumed session keeps the mode it was created with.
  const mode: SessionMode = session.mode ?? requestedMode;

  const suggestedIds = routeFeature(repo, feature);

  // feature tags from routes
  const featureTags: string[] = [];
  const text = feature.toLowerCase();
  for (const route of repo.routes()) {
    const hit = route.match.some((term) => text.includes(term.toLowerCase()));
    if (hit) {
      for (const term of route.match) {
        if (text.includes(term.toLowerCase()) && !featureTags.includes(term)) {
          featureTags.push(term);
        }
      }
    }
  }

  const components: string[] = [];
  for (const [re, comp] of COMPONENT_KEYWORDS) {
    if (re.test(feature) && !components.includes(comp)) components.push(comp);
  }

  const nextSteps = getModePolicy(mode).nextSteps;

  return { session, mode, suggestedIds, featureTags, components, nextSteps };
}

export async function requireSession(
  store: KbStore,
  sessionId: string,
  apiKeyId: string,
): Promise<SessionRecord> {
  const session = await store.getSession(sessionId.trim());
  if (!session) {
    throw new KbError(
      "SESSION_NOT_FOUND",
      `Unknown session "${sessionId}". Call start_session first.`,
    );
  }
  if (session.apiKeyId !== apiKeyId) {
    throw new KbError("SESSION_FORBIDDEN", "This session belongs to a different API key.");
  }
  return session;
}

export interface CitationReport {
  sessionId: string;
  citedIds: string[];
  /** Known IDs that were never fetched in this session. */
  unfetched: string[];
  /** IDs not present in the catalog. */
  unknown: string[];
  /** Known but deprecated IDs. */
  deprecated: string[];
  compliant: boolean;
}

/**
 * Verify that cited IDs were actually fetched in this session.
 * This proves fetch history, not semantic support for a claim.
 */
export async function verifyCitations(
  store: KbStore,
  catalog: CatalogLookup,
  session: SessionRecord,
  citedIds: string[],
): Promise<CitationReport> {
  const ids = [...new Set(citedIds.map((id) => id.trim().toUpperCase()).filter(Boolean))];
  if (ids.length === 0) {
    throw new KbError("INVALID_INPUT", "citedIds must contain at least one document ID.");
  }

  const fetched = new Set(session.fetched);
  const unfetched: string[] = [];
  const unknown: string[] = [];
  const deprecated: string[] = [];

  for (const id of ids) {
    if (!catalog.has(id)) {
      unknown.push(id);
      continue;
    }
    if (catalog.doc(id)?.frontMatter.status === "deprecated") {
      deprecated.push(id);
      continue;
    }
    if (!fetched.has(id)) unfetched.push(id);
  }

  await store.saveCompliance({
    sessionId: session.id,
    citedIds: ids,
    unfetched,
    unknown,
  });

  return {
    sessionId: session.id,
    citedIds: ids,
    unfetched,
    unknown,
    deprecated,
    compliant: unfetched.length === 0 && unknown.length === 0 && deprecated.length === 0,
  };
}
