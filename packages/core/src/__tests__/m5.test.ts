import assert from "node:assert/strict";
import { test } from "node:test";
import { createKb, isCleanContent, scanContent } from "../index";
import { assertStagePackAllowed, getModePolicy, sessionMode, sessionPolicy } from "../services/policy.service";
import { KbError } from "../errors";

test("injection scan: no document contains imperative tool-use instructions", () => {
  const kb = createKb();
  const bad: string[] = [];
  for (const doc of kb.versionedDocs()) {
    const rendered = kb.repo ? "" : "";
    const findings = scanContent(JSON.stringify(doc));
    if (findings.length > 0) {
      bad.push(`${doc.id}: ${findings.map((f) => f.code).join(",")}`);
    }
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("source URLs in every document are on the allow-list", () => {
  const kb = createKb();
  const bad: string[] = [];
  for (const doc of kb.versionedDocs()) {
    for (const source of doc.sources) {
      const findings = scanContent(source.url);
      if (findings.some((f) => f.code === "DISALLOWED_URL")) bad.push(`${doc.id}: ${source.url}`);
    }
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("quick mode disables stage packs", () => {
  assert.throws(() => assertStagePackAllowed("quick", "proposal"), KbError);
});

test("audit mode restricts stage packs to audit and critique", () => {
  assert.doesNotThrow(() => assertStagePackAllowed("audit", "audit"));
  assert.doesNotThrow(() => assertStagePackAllowed("audit", "critique"));
  assert.throws(() => assertStagePackAllowed("audit", "proposal"), KbError);
});

test("full mode enables the approval gate policy flag", () => {
  const policy = getModePolicy("full");
  assert.equal(policy.approvalRequiredBeforeCode, true);
  const quick = getModePolicy("quick");
  assert.equal(quick.approvalRequiredBeforeCode, false);
});

test("sessionPolicy is advisory and labelled with its source", () => {
  const p = sessionPolicy({ mode: "audit", tokenBudget: 8000 }, "2.0.0");
  assert.equal(p.source, "ux-kb-server");
  assert.equal(p.advisory, true);
  assert.equal(p.mode, "audit");
});

test("sessionMode defaults v1 sessions to full", () => {
  assert.equal(sessionMode({}), "full");
});
