import { ContentRepository, type RepositoryOptions } from "./content/repository";
import { getChecklist, getDoc, listDocs, requireDoc, type DocFilter } from "./services/docs.service";
import { getStagePack, renderPack, routeFeature } from "./services/packs.service";
import { searchDocs, type SearchOptions } from "./services/search.service";
import { getActiveRelease, type ActiveRelease } from "./services/release.service";
import type { ChecklistItem, Doc } from "./schemas/doc";
import type { PackResult, SearchHit } from "./schemas/pack";

export interface KbOptions extends RepositoryOptions {}

/**
 * Facade over the content repository. Content is read from the published
 * Markdown tree; auth, sessions, usage and gaps live in the KbStore.
 */
export class Kb {
  readonly repo: ContentRepository;

  constructor(options: KbOptions = {}) {
    this.repo = new ContentRepository(options);
  }

  get version(): string {
    return this.repo.release().version;
  }

  release(): ActiveRelease {
    return getActiveRelease(this.repo);
  }

  docs(filter?: DocFilter): Doc[] {
    return listDocs(this.repo, filter);
  }

  doc(id: string): Doc | undefined {
    return getDoc(this.repo, id);
  }

  requireDoc(id: string): Doc {
    return requireDoc(this.repo, id);
  }

  search(query: string, options?: SearchOptions): SearchHit[] {
    return searchDocs(this.repo, query, options);
  }

  pack(stage: string, feature?: string): PackResult {
    return getStagePack(this.repo, stage, feature);
  }

  renderPack(pack: PackResult): string {
    return renderPack(pack);
  }

  checklist(ids: string[]): ChecklistItem[] {
    return getChecklist(this.repo, ids);
  }

  routeFeature(feature: string): string[] {
    return routeFeature(this.repo, feature);
  }

  refresh(): void {
    this.repo.refresh();
  }
}

export function createKb(options: KbOptions = {}): Kb {
  return new Kb(options);
}
