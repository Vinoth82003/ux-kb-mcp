import type { ContentRepository } from "../content/repository";
import type { ReleaseFile } from "../schemas/pack";

export interface ActiveRelease extends ReleaseFile {
  docCount: number;
  packCount: number;
  routeCount: number;
}

export function getActiveRelease(repo: ContentRepository): ActiveRelease {
  const release = repo.release();
  return {
    ...release,
    docCount: repo.docs().length,
    packCount: repo.packs().size,
    routeCount: repo.routes().length,
  };
}
