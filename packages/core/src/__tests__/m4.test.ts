import assert from "node:assert/strict";
import { test } from "node:test";
import {
  coreScreenGateItems,
  createKb,
  gateVerifyCoverage,
  screenTypeExtraItems,
  startGate,
} from "../index";
import { MemoryStore } from "../store/memory";
import { createApiKey } from "../services/auth.service";
import { startSession } from "../services/session.service";

test("core screen gate gives every blocker/major a verify hint", () => {
  const items = coreScreenGateItems();
  assert.deepEqual(gateVerifyCoverage(items), []);
  assert.ok(items.filter((i) => i.severity === "blocker").length >= 5);
});

test("core screen gate has Playwright and one other framework snippet", () => {
  const items = coreScreenGateItems();
  const frameworks = new Set(
    items.flatMap((i) => (i.verify?.snippets ?? []).map((s) => s.framework)),
  );
  assert.ok(frameworks.has("playwright"));
  assert.ok(frameworks.size >= 2);
});

test("screen-type extras give every blocker/major a verify hint", () => {
  for (const type of ["list", "form", "dashboard"]) {
    assert.deepEqual(gateVerifyCoverage(screenTypeExtraItems(type)), []);
  }
});

test("component checks created by start_gate carry verify hints", async () => {
  const kb = createKb();
  const store = new MemoryStore();
  const { record } = await createApiKey(store, { name: "t" });
  const { session } = await startSession(store, kb.repo, {
    apiKeyId: record.id,
    kbVersion: kb.version,
    feature: "table",
  });
  const gate = await startGate(store, kb.repo, session, {
    sessionId: session.id,
    screen: "Invoices",
    components: ["table", "button"],
    screenType: "list",
  });
  assert.deepEqual(gateVerifyCoverage(gate.items), []);
  assert.ok(gate.items.some((i) => i.scope === "component" && i.verify?.hint));
});
