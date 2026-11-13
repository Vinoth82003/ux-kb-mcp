import type { SearchHit } from "../schemas/pack";
import type { ContentRepository } from "../content/repository";
import { KbError } from "../errors";

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "how", "in",
  "is", "it", "of", "on", "or", "should", "that", "the", "this", "to", "use",
  "using", "what", "when", "where", "which", "with",
]);

export function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .map((term) => term.replace(/^-+|-+$/g, ""))
    .filter((term) => term.length > 1 && !STOPWORDS.has(term));
}

function countOccurrences(haystack: string, needle: string): number {
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1 && count < 20) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

export interface SearchOptions {
  domain?: string;
  limit?: number;
  includeDeprecated?: boolean;
}

/**
 * Deterministic keyword search. Good enough for ~90 short docs; swap for
 * Postgres full-text or pgvector once the KB passes ~300 docs.
 */
export function searchDocs(
  repo: ContentRepository,
  query: string,
  options: SearchOptions = {},
): SearchHit[] {
  const raw = query.trim().toLowerCase();
  if (!raw) throw new KbError("INVALID_QUERY", "Search query must not be empty.");

  const terms = tokenizeQuery(query);
  const limit = Math.min(Math.max(options.limit ?? 10, 1), 50);
  const hits: SearchHit[] = [];

  for (const doc of repo.docs()) {
    const fm = doc.frontMatter;
    if (options.domain && fm.domain !== options.domain) continue;
    if (!options.includeDeprecated && fm.status === "deprecated") continue;

    const id = fm.id.toLowerCase();
    const title = fm.title.toLowerCase();
    const tags = fm.tags.join(" ").toLowerCase();
    const summary = doc.summary.toLowerCase();
    const body = doc.body.toLowerCase();

    let score = 0;
    if (id === raw) score += 200;
    else if (id.includes(raw)) score += 60;

    for (const term of terms) {
      if (id.includes(term)) score += 12;
      if (title.includes(term)) score += 30;
      if (tags.includes(term)) score += 18;
      if (summary.includes(term)) score += 10;
      const bodyHits = countOccurrences(body, term);
      score += Math.min(bodyHits, 5) * 2;
    }

    if (score <= 0) continue;
    if (fm.priority === "core") score += 5;

    hits.push({
      id: fm.id,
      title: fm.title,
      summary: doc.summary,
      domain: fm.domain,
      tags: fm.tags,
      status: fm.status,
      score,
    });
  }

  return hits.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, limit);
}
