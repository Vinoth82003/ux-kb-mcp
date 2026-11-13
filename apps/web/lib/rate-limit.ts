import { PrismaRateLimiter } from "@ux-kb/core";
import { getPrisma } from "./db";

let limiter: PrismaRateLimiter | null = null;

/** Lazily construct the limiter so builds without DATABASE_URL still compile. */
export function getLimiter(): PrismaRateLimiter {
  if (!limiter) limiter = new PrismaRateLimiter(getPrisma(), "minute");
  return limiter;
}

export const QUOTAS = {
  MEMBER_PER_DAY: 10_000,
  ADMIN_PER_DAY: 100_000,
  ANON_PER_MINUTE: 30,
  SESSIONS_PER_HOUR: 100,
} as const;
