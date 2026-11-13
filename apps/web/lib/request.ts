import { createHmac, randomUUID } from "node:crypto";

/**
 * Best-effort client IP. On Vercel the first `x-forwarded-for` entry is the
 * client; `x-real-ip` is the fallback. Values are never trusted for
 * authorization, only for coarse abuse limiting.
 */
export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || null;
}

/** Pseudonymous IP key. Raw addresses never reach the rate-limit table. */
export function hashIp(ip: string | null): string {
  if (!ip) return "ip:unknown";
  const secret = process.env.KEY_HASH_SECRET ?? "";
  return `ip:${createHmac("sha256", secret).update(ip).digest("hex").slice(0, 32)}`;
}

export function requestId(): string {
  return randomUUID();
}

/** Reject cross-site form posts that slip past SameSite cookies. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin form posts and non-browser clients
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
