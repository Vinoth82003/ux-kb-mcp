import assert from "node:assert/strict";
import { test } from "node:test";
import { createKb, diffSince, reportFalsePositive, topFailures } from "../index";
import { MemoryStore } from "../store/memory";
import { createApiKey } from "../services/auth.service";
import { startSession } from "../services/session.service";
import { startGate } from "../services/gate.service";
import { reportCheck } from "../services/gate.service";

test("report_false_positive returns a ticket and increments noise score", async () => {
  const store = new MemoryStore();
  const r1 = await reportFalsePositive(store, { itemId: "CMP-001.c1", reason: "not applicable to our stack" });
  const r2 = await reportFalsePositive(store, { itemId: "CMP-001.c1", reason: "duplicate noise report" });
  assert.match(r1.ticketId, /^FP-/);
  assert.equal(r1.noiseScore, 1);
  assert.equal(r2.noiseScore, 2);
});

test("top_failures aggregates gate failures", async () => {
  const kb = createKb();
  const store = new MemoryStore();
  const { record } = await createApiKey(store, { name: "t" });
  const { session } = await startSession(store, kb.repo, { apiKeyId: record.id, kbVersion: kb.version, feature: "table" });
  const gate = await startGate(store, kb.repo, session, { sessionId: session.id, screen: "X", components: [], screenType: "other" });
  await reportCheck(store, gate.gateId, session.id, [
    { itemId: "SCR.loading", result: "fail", note: "no spinner shown" },
  ]);
  const top = await topFailures(store, kb.repo, { window: "30d", limit: 5 });
  assert.ok(top.some((e) => e.itemId === "SCR.loading"));
});

test("diff_since reports changed when versions differ", () => {
  const kb = createKb();
  const result = diffSince(kb.repo, { sessionId: "s", sinceVersion: "1.0.0", ids: ["CMP-001"] });
  assert.equal(result.changed, true);
  assert.equal(result.toVersion, kb.version);
  assert.ok(result.docs[0].checks.length >= 0);
});

test("diff_since reports unchanged when versions match", () => {
  const kb = createKb();
  const result = diffSince(kb.repo, { sessionId: "s", sinceVersion: kb.version, ids: ["CMP-001"] });
  assert.equal(result.changed, false);
});
