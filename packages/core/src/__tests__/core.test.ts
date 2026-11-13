import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createKb,
  estimateTokens,
  extractRules,
  lintDoc,
  parseDoc,
  type Doc,
} from "../index";

const VALID = `---
id: CMP-001
title: "Test doc"
domain: components
group: M03
type: pattern
status: reviewed
rev: 1
priority: core
stages: [proposal]
tags: [buttons]
applies_to: [web]
related: [CMP-002]
sources:
  - name: "Example"
    url: "https://example.com"
updated: 2026-11-12
---

# CMP-001 Test doc

## Summary
One line.

## MUST
- CMP-001.M1: Do the thing.

## CHECK
- [ ] Thing done?
`;

function doc(markdown = VALID): Doc {
  return parseDoc(markdown, "/virtual/CMP-001-test-doc.md");
}

test("estimateTokens is deterministic and rounds up", () => {
  assert.equal(estimateTokens(""), 0);
  assert.equal(estimateTokens("abcd"), 1);
  assert.equal(estimateTokens("abcde"), 2);
});

test("parseDoc normalizes front matter dates and extracts sections", () => {
  const parsed = doc();
  assert.equal(parsed.frontMatter.id, "CMP-001");
  assert.equal(parsed.frontMatter.updated, "2026-11-12");
  assert.equal(parsed.summary, "One line.");
  assert.match(parsed.sections.must ?? "", /Do the thing/);
});

test("parseDoc rejects an invalid domain", () => {
  assert.throws(() => parseDoc(VALID.replace("domain: components", "domain: nope")));
});

test("extractRules keeps the full rule ID", () => {
  const rules = extractRules(doc());
  assert.deepEqual(
    rules.map((rule) => rule.id),
    ["CMP-001.M1"],
  );
});

test("lintDoc accepts a clean doc", () => {
  const issues = lintDoc(doc(), new Set(["CMP-001", "CMP-002"]));
  assert.deepEqual(issues, []);
});

test("lintDoc requires MUST and CHECK", () => {
  const broken = doc(VALID.replace("## MUST\n- CMP-001.M1: Do the thing.\n", ""));
  const codes = lintDoc(broken, new Set(["CMP-001", "CMP-002"])).map((issue) => issue.code);
  assert.ok(codes.includes("SEC001"));
});

test("lintDoc flags self-references and unknown related IDs", () => {
  const selfLink = doc(VALID.replace("related: [CMP-002]", "related: [CMP-001]"));
  const unknown = doc(VALID.replace("related: [CMP-002]", "related: [NOPE-999]"));

  assert.ok(
    lintDoc(selfLink, new Set(["CMP-001"])).some((issue) => issue.code === "REL002"),
  );
  assert.ok(
    lintDoc(unknown, new Set(["CMP-001"])).some((issue) => issue.code === "REL001"),
  );
});

test("lintDoc flags an ID/domain prefix mismatch", () => {
  const mismatched = doc(VALID.replace("id: CMP-001", "id: VIS-001").replace(/CMP-001\.M1/g, "VIS-001.M1"));
  const codes = lintDoc(mismatched, new Set(["VIS-001", "CMP-002"])).map((issue) => issue.code);
  assert.ok(codes.includes("ID002"));
});

test("repository loads the full catalog with unique IDs", () => {
  const kb = createKb();
  const docs = kb.docs();
  assert.ok(docs.length >= 70, `expected the seeded catalog, found ${docs.length}`);
  assert.equal(new Set(docs.map((entry) => entry.frontMatter.id)).size, docs.length);
});

test("get_doc returns a known doc and rejects an unknown one", () => {
  const kb = createKb();
  assert.equal(kb.requireDoc("CMP-001").frontMatter.title, "Buttons");
  assert.throws(() => kb.requireDoc("NOPE-999"), /Unknown document ID/);
});

test("search ranks the buttons doc for a button query", () => {
  const kb = createKb();
  const hits = kb.search("buttons");
  assert.equal(hits[0]?.id, "CMP-001");
});

test("search respects the domain filter", () => {
  const kb = createKb();
  const hits = kb.search("contrast", { domain: "accessibility", limit: 5 });
  assert.ok(hits.length > 0);
  assert.ok(hits.every((hit) => hit.domain === "accessibility"));
});

test("stage pack applies feature routing without duplicating base docs", () => {
  const kb = createKb();
  const pack = kb.pack("proposal", "pricing page with plans");
  assert.ok(pack.routedIds.includes("SAAS-006"));
  const ids = [...pack.baseDocs, ...pack.routedDocs].map((entry) => entry.frontMatter.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(pack.baseDocs.length, 9);
});

test("stage pack reports token estimate against its budget", () => {
  const kb = createKb();
  const pack = kb.pack("proposal");
  assert.ok(pack.tokenEstimate > 0);
  assert.equal(typeof pack.overBudget, "boolean");
  assert.equal(pack.budgetTokens, 6000);
});

test("checklist returns only CHECK items", () => {
  const kb = createKb();
  const items = kb.checklist(["CMP-001"]);
  assert.ok(items.length > 0);
  assert.ok(items.every((item) => item.docId === "CMP-001"));
});
