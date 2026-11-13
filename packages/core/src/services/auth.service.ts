import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { ApiKeyRecord, KbStore } from "../store/types";
import { KbError } from "../errors";

const KEY_PREFIX = "uxkb_";

/**
 * Hash an API key with HMAC-SHA256. Only the hash is stored; the plaintext key
 * is shown once at creation.
 */
export function hashApiKey(key: string, secret: string = process.env.KEY_HASH_SECRET ?? ""): string {
  return createHmac("sha256", secret).update(key).digest("hex");
}

export function generateApiKey(): string {
  return `${KEY_PREFIX}${randomBytes(24).toString("base64url")}`;
}

export interface CreateKeyOptions {
  name: string;
  pinnedVersion?: string | null;
  rateLimit?: number;
  secret?: string;
}

export interface CreatedKey {
  /** Plaintext key. Shown once; never persisted. */
  key: string;
  record: ApiKeyRecord;
}

export async function createApiKey(store: KbStore, options: CreateKeyOptions): Promise<CreatedKey> {
  const name = options.name.trim();
  if (!name) throw new KbError("INVALID_INPUT", "API key name must not be empty.");

  const key = generateApiKey();
  const record = await store.createKey({
    name,
    hashedKey: hashApiKey(key, options.secret),
    pinnedVersion: options.pinnedVersion ?? null,
    rateLimit: options.rateLimit ?? 120,
  });
  return { key, record };
}

/** Accept "Bearer <key>" or a bare key. Returns null for missing/invalid/revoked keys. */
export async function authenticate(
  store: KbStore,
  authorization: string | undefined,
): Promise<ApiKeyRecord | null> {
  const raw = authorization?.trim();
  if (!raw) return null;
  const key = raw.toLowerCase().startsWith("bearer ") ? raw.slice(7).trim() : raw;
  if (!key) return null;

  const record = await store.findKeyByHash(hashApiKey(key));
  if (!record || record.revokedAt) return null;
  await store.touchKey(record.id);
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
  return store.createKey({ name: "stdio-local", hashedKey, rateLimit: 10_000 });
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
  return store.createKey({ name: "http-dev", hashedKey, rateLimit });
}
