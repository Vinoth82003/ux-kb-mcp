import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { ApiKeyRecord, KbStore, UserRole } from "../store/types";
import { KbError } from "../errors";

const KEY_PREFIX = "uxkb_";
const KEY_BODY_BYTES = 24; // 192 bits of entropy
const KEY_PATTERN = /^uxkb_[A-Za-z0-9_-]{32}$/;
const MAX_KEY_LENGTH = 64;

export const KEY_LIMITS = {
  MEMBER: { maxActiveKeys: 3, maxRateLimit: 120, defaultRateLimit: 60 },
  ADMIN: { maxActiveKeys: 10, maxRateLimit: 600, defaultRateLimit: 300 },
} as const;

/**
 * Hash an API key with HMAC-SHA256. Only the hash is stored; the plaintext key
 * is shown once at creation.
 */
export function hashApiKey(key: string, secret: string = process.env.KEY_HASH_SECRET ?? ""): string {
  return createHmac("sha256", secret).update(key).digest("hex");
}

export function generateApiKey(): string {
  return `${KEY_PREFIX}${randomBytes(KEY_BODY_BYTES).toString("base64url")}`;
}

/** Display-safe fragment. Not enough to authenticate; safe to render. */
export function keyPrefix(key: string): string {
  return key.slice(0, KEY_PREFIX.length + 6);
}

/** Cheap syntactic check so malformed input never reaches the database. */
export function isWellFormedKey(key: string): boolean {
  return key.length <= MAX_KEY_LENGTH && KEY_PATTERN.test(key);
}

export function isKeyExpired(record: Pick<ApiKeyRecord, "expiresAt">, now = Date.now()): boolean {
  return record.expiresAt !== null && record.expiresAt.getTime() <= now;
}

export function hasScope(record: Pick<ApiKeyRecord, "scopes">, scope: string): boolean {
  return record.scopes.includes(scope);
}

export interface CreateKeyOptions {
  name: string;
  ownerId?: string | null;
  role?: UserRole;
  pinnedVersion?: string | null;
  rateLimit?: number;
  expiresAt?: Date | null;
  scopes?: string[];
  secret?: string;
  /** Internal: rotation creates a replacement while the old key still counts. */
  bypassKeyLimit?: boolean;
}

export interface CreatedKey {
  /** Plaintext key. Shown once; never persisted. */
  key: string;
  record: ApiKeyRecord;
}

export async function createApiKey(store: KbStore, options: CreateKeyOptions): Promise<CreatedKey> {
  const name = options.name.trim();
  if (!name) throw new KbError("INVALID_INPUT", "API key name must not be empty.");
  if (name.length > 64) throw new KbError("INVALID_INPUT", "API key name must be 64 characters or fewer.");

  const role: UserRole = options.role ?? "MEMBER";
  const limits = KEY_LIMITS[role];
  const rateLimit = options.rateLimit ?? limits.defaultRateLimit;
  if (!Number.isInteger(rateLimit) || rateLimit < 10 || rateLimit > limits.maxRateLimit) {
    throw new KbError(
      "INVALID_INPUT",
      `Rate limit must be an integer between 10 and ${limits.maxRateLimit}.`,
    );
  }

  if (options.ownerId && !options.bypassKeyLimit) {
    const active = await store.countActiveKeys(options.ownerId);
    if (active >= limits.maxActiveKeys) {
      throw new KbError(
        "KEY_LIMIT_REACHED",
        `You already have ${active} active keys. Revoke one before creating another.`,
      );
    }
  }

  const key = generateApiKey();
  const record = await store.createKey({
    name,
    hashedKey: hashApiKey(key, options.secret),
    prefix: keyPrefix(key),
    scopes: options.scopes ?? ["mcp:read"],
    pinnedVersion: options.pinnedVersion ?? null,
    rateLimit,
    expiresAt: options.expiresAt ?? null,
    ownerId: options.ownerId ?? null,
  });
  return { key, record };
}

/**
 * Accept "Bearer <key>" or a bare key. Returns null for missing, malformed,
 * expired, or revoked keys.
 */
export async function authenticate(
  store: KbStore,
  authorization: string | undefined,
  options?: { ip?: string },
): Promise<ApiKeyRecord | null> {
  const raw = authorization?.trim();
  if (!raw) return null;
  const key = raw.toLowerCase().startsWith("bearer ") ? raw.slice(7).trim() : raw;
  if (!key || !isWellFormedKey(key)) return null;

  const record = await store.findKeyByHash(hashApiKey(key));
  if (!record || record.revokedAt || isKeyExpired(record)) return null;
  if (!hasScope(record, "mcp:read")) return null;

  // Keep write amplification low: at most one lastUsedAt update per minute.
  const stale = !record.lastUsedAt || Date.now() - record.lastUsedAt.getTime() > 60_000;
  if (stale) await store.touchKey(record.id, options?.ip);
  return record;
}

/** Constant-time comparison helper for non-hash contexts. */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Create (or reuse) the implicit key used by the stdio transport. */
export async function ensureLocalKey(store: KbStore): Promise<ApiKeyRecord> {
  const hashedKey = hashApiKey("stdio-local");
  const existing = await store.findKeyByHash(hashedKey);
  if (existing) return existing;
  return store.createKey({
    name: "stdio-local",
    hashedKey,
    prefix: "stdio-local",
    rateLimit: 10_000,
    scopes: ["mcp:read"],
  });
}

/** Bootstrap a known plaintext key for local HTTP development. */
export async function ensureDevKey(
  store: KbStore,
  plaintext: string,
  rateLimit = 120,
): Promise<ApiKeyRecord> {
  const hashedKey = hashApiKey(plaintext);
  const existing = await store.findKeyByHash(hashedKey);
  if (existing) return existing;
  return store.createKey({
    name: "http-dev",
    hashedKey,
    prefix: keyPrefix(plaintext),
    rateLimit,
    scopes: ["mcp:read"],
  });
}
