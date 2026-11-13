import type { ChecklistItem, Doc, Stage } from "../schemas/doc";
import type { ContentRepository } from "../content/repository";
import { extractChecklist } from "../content/parser";
import { KbError } from "../errors";

export interface DocFilter {
  domain?: string;
  tag?: string;
  stage?: string;
  status?: string;
  priority?: string;
}

export function listDocs(repo: ContentRepository, filter: DocFilter = {}): Doc[] {
  return repo.docs().filter((doc) => {
    const fm = doc.frontMatter;
    if (filter.domain && fm.domain !== filter.domain) return false;
    if (filter.tag && !fm.tags.includes(filter.tag)) return false;
    if (filter.stage && !fm.stages.includes(filter.stage as Stage)) return false;
    if (filter.status && fm.status !== filter.status) return false;
    if (filter.priority && fm.priority !== filter.priority) return false;
    return true;
  });
}

export function getDoc(repo: ContentRepository, id: string): Doc | undefined {
  return repo.doc(id);
}

export function requireDoc(repo: ContentRepository, id: string): Doc {
  const doc = repo.doc(id);
  if (!doc) {
    throw new KbError(
      "DOC_NOT_FOUND",
      `Unknown document ID "${id}". Use search_kb to find valid IDs.`,
    );
  }
  return doc;
}

export function getChecklist(repo: ContentRepository, ids: string[]): ChecklistItem[] {
  return ids.flatMap((id) => extractChecklist(requireDoc(repo, id)));
}
