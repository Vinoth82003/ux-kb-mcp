import type { Doc } from "../schemas/doc";
import type { KbStore, SessionRecord } from "../store/types";
import type { ContentRepository } from "../content/repository";
import { KbError } from "../errors";
import { routeFeature } from "./packs.service";

/** Minimal catalog surface needed to verify citations (easy to stub in tests). */
export interface CatalogLookup {
  has(id: string): boolean;
  doc(id: string): Doc | undefined;
}

export interface StartSessionResult {
  session: SessionRecord;
  /** Feature-routed docs worth fetching first. */
  suggestedIds: string[];
}

export async function startSession(
  store: KbStore,
  repo: ContentRepository,
  input: { apiKeyId: string; kbVersion: string; feature: string },
): Promise<StartSessionResult> {
  const feature = input.feature.trim();
  if (!feature) {
    throw new KbError("INVALID_INPUT", "feature must describe what is being designed.");
  }
  if (feature.length > 2000) {
    throw new KbError("INVALID_INPUT", "feature must be 2000 characters or fewer.");
  }

  const session = await store.createSession({
    apiKeyId: input.apiKeyId,
    feature,
    kbVersion: input.kbVersion,
  });

  return { session, suggestedIds: routeFeature(repo, feature) };
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
