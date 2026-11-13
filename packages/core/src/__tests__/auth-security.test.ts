import test from "node:test";
import assert from "node:assert/strict";
import { MemoryStore } from "../store/memory";
import {
  authenticate,
  createApiKey,
  generateApiKey,
  hashApiKey,
  isKeyExpired,
  isWellFormedKey,
  keyPrefix,
} from "../services/auth.service";
import { RateLimiter } from "../services/rate-limit.service";

process.env.KEY_HASH_SECRET = "test-secret";

test("generated keys are well formed and carry the uxkb_ prefix", () => {
  const key = generateApiKey();
  assert.match(key, /^uxkb_[A-Za-z0-9_-]{32}$/);
  assert.equal(isWellFormedKey(key), true);
  assert.equal(isWellFormedKey("uxkb_short"), false);
  assert.equal(isWellFormedKey("nope_" + "a".repeat(32)), false);
  assert.equal(isWellFormedKey("x".repeat(200)), false);
});

test("the display prefix never reveals the full key", () => {
  const key = generateApiKey();
  const prefix = keyPrefix(key);
  assert.ok(prefix.startsWith("uxkb_"));
  assert.ok(prefix.length < key.length);
  assert.equal(key.includes(prefix), true);
});

test("hashing is deterministic and secret-dependent", () => {
  const key = generateApiKey();
  assert.equal(hashApiKey(key, "a"), hashApiKey(key, "a"));
  assert.notEqual(hashApiKey(key, "a"), hashApiKey(key, "b"));
});

test("createApiKey returns plaintext once and stores only a hash", async () => {
  const store = new MemoryStore();
  const created = await createApiKey(store, { name: "laptop", ownerId: "user-1", role: "MEMBER" });

  assert.equal(created.record.hashedKey, hashApiKey(created.key));
  assert.notEqual(created.record.hashedKey, created.key);
  assert.equal(created.record.ownerId, "user-1");
  assert.deepEqual(created.record.scopes, ["mcp:read"]);
  assert.equal(created.record.prefix, keyPrefix(created.key));

  const found = await store.findKeyByHash(created.record.hashedKey);
  assert.equal(found?.id, created.record.id);
});

test("authenticate accepts a valid key and rejects malformed input", async () => {
  const store = new MemoryStore();
  const created = await createApiKey(store, { name: "cli", ownerId: "user-1" });

  assert.equal((await authenticate(store, `Bearer ${created.key}`))?.id, created.record.id);
  assert.equal((await authenticate(store, created.key))?.id, created.record.id);
  assert.equal(await authenticate(store, "Bearer not-a-key"), null);
  assert.equal(await authenticate(store, undefined), null);
  assert.equal(await authenticate(store, "Bearer uxkb_" + "a".repeat(32)), null);
});

test("revoked keys stop authenticating immediately", async () => {
  const store = new MemoryStore();
  const created = await createApiKey(store, { name: "cli", ownerId: "user-1" });

  await store.revokeKey(created.record.id, "test");
  assert.equal(await authenticate(store, `Bearer ${created.key}`), null);

  const record = await store.getKey(created.record.id);
  assert.equal(record?.revokedReason, "test");
});

test("expired keys stop authenticating", async () => {
  const store = new MemoryStore();
  const created = await createApiKey(store, {
    name: "old",
    ownerId: "user-1",
    expiresAt: new Date(Date.now() - 1000),
  });

  assert.equal(isKeyExpired(created.record), true);
  assert.equal(await authenticate(store, `Bearer ${created.key}`), null);
});

test("members cannot exceed their active-key quota", async () => {
  const store = new MemoryStore();
  for (let index = 0; index < 3; index += 1) {
    await createApiKey(store, { name: `key-${index}`, ownerId: "user-1", role: "MEMBER" });
  }
  await assert.rejects(
    () => createApiKey(store, { name: "key-4", ownerId: "user-1", role: "MEMBER" }),
    /active keys/,
  );

  // Rotation bypasses the quota because the old key is about to be revoked.
  const rotated = await createApiKey(store, {
    name: "key-0",
    ownerId: "user-1",
    role: "MEMBER",
    bypassKeyLimit: true,
  });
  assert.ok(rotated.key.startsWith("uxkb_"));
});

test("rate limits outside the allowed range are rejected", async () => {
  const store = new MemoryStore();
  await assert.rejects(
    () => createApiKey(store, { name: "fast", ownerId: "u", rateLimit: 10_000 }),
    /Rate limit/,
  );
  await assert.rejects(
    () => createApiKey(store, { name: "slow", ownerId: "u", rateLimit: 1 }),
    /Rate limit/,
  );
});

test("key listings and usage are scoped to the owner", async () => {
  const store = new MemoryStore();
  const a = await createApiKey(store, { name: "a", ownerId: "user-a" });
  const b = await createApiKey(store, { name: "b", ownerId: "user-b" });

  const listA = await store.listKeysByOwner("user-a");
  assert.deepEqual(
    listA.map((key) => key.id),
    [a.record.id],
  );
  assert.equal((await store.listKeysByOwner("user-b"))[0]?.id, b.record.id);

  await store.logUsage({ apiKeyId: a.record.id, tool: "search_kb", args: {}, latencyMs: 1, ok: true });
  await store.logUsage({ apiKeyId: b.record.id, tool: "get_doc", args: {}, latencyMs: 1, ok: true });

  const usageA = await store.listUsageByOwner("user-a");
  assert.equal(usageA.length, 1);
  assert.equal(usageA[0]?.tool, "search_kb");
});

test("audit rows capture the actor and action", async () => {
  const store = new MemoryStore();
  await store.audit({ actor: "github:test", action: "key.create", target: "key-1" });
  const rows = await store.listAudit();
  assert.equal(rows[0]?.action, "key.create");
  assert.equal(rows[0]?.actor, "github:test");
});

test("the in-memory limiter blocks after the limit inside one window", () => {
  const limiter = new RateLimiter(60_000);
  const now = 1_000_000;
  assert.equal(limiter.check("k", 2, now).allowed, true);
  assert.equal(limiter.check("k", 2, now + 1).allowed, true);
  const blocked = limiter.check("k", 2, now + 2);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterMs > 0);
  assert.equal(limiter.check("k", 2, now + 60_001).allowed, true);
});
