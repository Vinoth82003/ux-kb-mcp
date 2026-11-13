export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * In-memory sliding-window limiter, one window per API key.
 *
 * Single-process only: a multi-instance deployment must move this to Redis or
 * Postgres. Rate limits are advisory protection, not billing enforcement.
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
    private readonly windowMs = 60_000,
  ) {}

  async check(keyId: string, limit: number, now = Date.now()): Promise<RateLimitResult> {
    if (!Number.isFinite(limit) || limit <= 0) {
      return { allowed: true, remaining: Number.POSITIVE_INFINITY, retryAfterMs: 0 };
    }

    const windowStart = new Date(Math.floor(now / this.windowMs) * this.windowMs);
    const rows = await this.prisma.$queryRaw<{ count: number }[]>`
      INSERT INTO "RateLimitWindow" ("keyId", "windowStart", "count")
      VALUES (${keyId}, ${windowStart}, 1)
      ON CONFLICT ("keyId", "windowStart")
      DO UPDATE SET "count" = "RateLimitWindow"."count" + 1
      RETURNING "count"`;
    const count = Number(rows[0]?.count ?? 1);

    if (count > limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(windowStart.getTime() + this.windowMs - now, 0),
      };
    }
    return { allowed: true, remaining: Math.max(0, limit - count), retryAfterMs: 0 };
  }

  async reset(keyId?: string): Promise<void> {
    if (keyId) {
      await this.prisma.rateLimitWindow.deleteMany({ where: { keyId } });
    } else {
      await this.prisma.rateLimitWindow.deleteMany({});
    }
  }
}
