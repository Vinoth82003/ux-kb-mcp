export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export type WindowKind = "minute" | "hour" | "day";

export const WINDOW_MS: Record<WindowKind, number> = {
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
};

/**
 * In-memory sliding-window limiter, one window per key.
 *
 * Single-process only. The Postgres limiter is used in production; this one
 * stays for tests and local development.
 */
export class RateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(private readonly windowMs = 60_000) {}

  check(keyId: string, limit: number, now = Date.now()): RateLimitResult {
    if (!Number.isFinite(limit) || limit <= 0) {
      return { allowed: true, remaining: Number.POSITIVE_INFINITY, retryAfterMs: 0 };
    }

    const cutoff = now - this.windowMs;
    const recent = (this.hits.get(keyId) ?? []).filter((stamp) => stamp > cutoff);

    if (recent.length >= limit) {
      const oldest = recent[0] ?? now;
      this.hits.set(keyId, recent);
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(oldest + this.windowMs - now, 0),
      };
    }

    recent.push(now);
    this.hits.set(keyId, recent);
    return { allowed: true, remaining: limit - recent.length, retryAfterMs: 0 };
  }

  reset(keyId?: string): void {
    if (keyId) this.hits.delete(keyId);
    else this.hits.clear();
  }
}

/**
 * Postgres-backed fixed-window limiter for serverless/multi-instance use.
 * Uses an atomic upsert so concurrent requests cannot bypass the limit.
 */
export class PrismaRateLimiter {
  constructor(
    private readonly prisma: import("@prisma/client").PrismaClient,
    private readonly defaultKind: WindowKind = "minute",
  ) {}

  async check(
    keyId: string,
    limit: number,
    now = Date.now(),
    kind: WindowKind = this.defaultKind,
  ): Promise<RateLimitResult> {
    if (!Number.isFinite(limit) || limit <= 0) {
      return { allowed: true, remaining: Number.POSITIVE_INFINITY, retryAfterMs: 0 };
    }

    const windowMs = WINDOW_MS[kind];
    const windowStart = new Date(Math.floor(now / windowMs) * windowMs);
    const rows = await this.prisma.$queryRaw<{ count: number }[]>`
      INSERT INTO "RateLimitWindow" ("keyId", "kind", "windowStart", "count")
      VALUES (${keyId}, ${kind}, ${windowStart}, 1)
      ON CONFLICT ("keyId", "kind", "windowStart")
      DO UPDATE SET "count" = "RateLimitWindow"."count" + 1
      RETURNING "count"`;
    const count = Number(rows[0]?.count ?? 1);

    if (count > limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(windowStart.getTime() + windowMs - now, 0),
      };
    }
    return { allowed: true, remaining: Math.max(0, limit - count), retryAfterMs: 0 };
  }

  /** Convenience for a second, coarser quota layer. */
  async checkQuota(keyId: string, limit: number, now = Date.now()): Promise<RateLimitResult> {
    return this.check(keyId, limit, now, "day");
  }

  async reset(keyId?: string): Promise<void> {
    if (keyId) {
      await this.prisma.rateLimitWindow.deleteMany({ where: { keyId } });
    } else {
      await this.prisma.rateLimitWindow.deleteMany({});
    }
  }

  /** Delete stale windows. Safe to call opportunistically. */
  async prune(olderThanMs = 2 * 86_400_000, now = Date.now()): Promise<number> {
    const cutoff = new Date(now - olderThanMs);
    const result = await this.prisma.rateLimitWindow.deleteMany({
      where: { windowStart: { lt: cutoff } },
    });
    return result.count;
  }
}
