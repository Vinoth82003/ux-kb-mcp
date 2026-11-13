import assert from "node:assert/strict";
import { test } from "node:test";
import {
  authenticate,
  createApiKey,
  createKb,
  ensureLocalKey,
  hashApiKey,
  RateLimiter,
  reportGap,
  requireSession,
  startSession,
  verifyCitations,
  type Doc,
} from "../index";
import { MemoryStore } from "../store/index";

function stubDoc(status: string): Doc {
  return { frontMatter: { status } } as unknown as Doc;
}

test("hashApiKey is deterministic and secret-sensitive", () => {
  assert.equal(hashApiKey("abc", "s1"), hashApiKey("abc", "s1"));
  assert.notEqual(hashApiKey("abc", "s1"), hashApiKey("abc", "s2"));
  assert.notEqual(hashApiKey("abc", "s1"), hashApiKey("abd", "s1"));
});

test("createApiKey returns plaintext once and authenticate accepts it", async () => {
  const store = new MemoryStore();
  const { key, record } = await createApiKey(store, { name: "laptop" });

  assert.match(key, /^uxkb_/);
  assert.equal(record.hashedKey, hashApiKey(key));
  assert.notEqual(record.hashedKey, key);

  const auth = await authenticate(store, `Bearer ${key}`);
  assert.equal(auth?.id, record.id);

  assert.equal(await authenticate(store, "Bearer uxkb_wrong"), null);
  assert.equal(await authenticate(store, undefined), null);

  await store.revokeKey(record.id);
  assert.equal(await authenticate(store, key), null);
});

test("ensureLocalKey is idempotent", async () => {
  const store = new MemoryStore();
  const first = await ensureLocalKey(store);
  const second = await ensureLocalKey(store);
  assert.equal(first.id, second.id);
  assert.equal((await store.listKeys()).length, 1);
});

test("rate limiter enforces a sliding window per key", () => {
  const limiter = new RateLimiter(1_000);
  assert.equal(limiter.check("key", 2, 1_000).allowed, true);
  assert.equal(limiter.check("key", 2, 1_100).allowed, true);

  const blocked = limiter.check("key", 2, 1_200);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterMs > 0);

  assert.equal(limiter.check("other", 2, 1_200).allowed, true);
  assert.equal(limiter.check("key", 2, 2_100).allowed, true);
});

test("start_session suggests routed docs and enforces key ownership", async () => {
  const kb = createKb();
  const store = new MemoryStore();
  const owner = await createApiKey(store, { name: "owner" });
  const other = await createApiKey(store, { name: "other" });

  const { session, suggestedIds } = await startSession(store, kb.repo, {
    apiKeyId: owner.record.id,
    kbVersion: kb.version,
    feature: "pricing page with plans",
  });

  assert.ok(suggestedIds.includes("SAAS-006"));
  assert.equal((await requireSession(store, session.id, owner.record.id)).id, session.id);
  await assert.rejects(
    () => requireSession(store, session.id, other.record.id),
    /different API key/,
  );
  await assert.rejects(() => requireSession(store, "ses_missing", owner.record.id), /Unknown session/);
});

test("verify_citations reports unfetched, unknown and deprecated IDs", async () => {
  const kb = createKb();
  const store = new MemoryStore();
  const owner = await createApiKey(store, { name: "owner" });
  const { session } = await startSession(store, kb.repo, {
    apiKeyId: owner.record.id,
    kbVersion: kb.version,
    feature: "table",
  });

  await store.addFetched(session.id, ["CMP-001"]);

  const catalog = {
    has: (id: string) => ["CMP-001", "VIS-002", "INT-006"].includes(id),
    doc: (id: string) =>
      id === "INT-006" ? stubDoc("deprecated") : id === "CMP-001" || id === "VIS-002" ? stubDoc("reviewed") : undefined,
  };

  const report = await verifyCitations(store, catalog, session, [
    "cmp-001",
    "VIS-002",
    "INT-006",
    "NOPE-999",
  ]);

  assert.deepEqual(report.citedIds, ["CMP-001", "VIS-002", "INT-006", "NOPE-999"]);
  assert.deepEqual(report.unfetched, ["VIS-002"]);
  assert.deepEqual(report.unknown, ["NOPE-999"]);
  assert.deepEqual(report.deprecated, ["INT-006"]);
  assert.equal(report.compliant, false);

  const clean = await verifyCitations(store, catalog, session, ["CMP-001"]);
  assert.equal(clean.compliant, true);

  const stored = await store.listCompliance(session.id);
  assert.equal(stored.length, 2);
  assert.deepEqual(stored[0]?.unfetched, []);
});

test("report_gap upserts and increments the same topic", async () => {
  const store = new MemoryStore();
  const first = await reportGap(store, "offline sync", "needed conflict UI guidance");
  const second = await reportGap(store, "offline sync", "still missing");

  assert.equal(second.id, first.id);
  assert.equal(second.count, 2);
  assert.equal((await store.listGaps()).length, 1);
});

test("usage logging records tool, args and outcome", async () => {
  const store = new MemoryStore();
  const { record } = await createApiKey(store, { name: "owner" });

  await store.logUsage({
    apiKeyId: record.id,
    tool: "get_doc",
    args: { id: "CMP-001" },
    latencyMs: 5,
    ok: true,
  });

  const usage = await store.listUsage(record.id);
  assert.equal(usage.length, 1);
  assert.equal(usage[0]?.tool, "get_doc");
  assert.equal(usage[0]?.ok, true);
});
