---
id: CW-004
title: "Empty States"
domain: content_writing
group: M07
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [empty-states, content-writing]
applies_to: [web, mobile]
related: [CW-001, SAAS-008, INT-005, A11Y-007]
sources:
  - name: "NN/g Empty State Interface Design"
    url: "https://www.nngroup.com/articles/empty-state-interface-design/"
  - name: "Material Design Empty States"
    url: "https://m2.material.io/design/communication/empty-states.html"
updated: 2026-11-15
---

# CW-004 — Empty States

## Summary
Empty states distinguish first use, filtered no-results, no records, no permission and unavailable data; this doc owns general empty-state copy, while dashboard-specific empty states live in SAAS-008.

## MUST
- CW-004.M1: Explain the actual reason and offer the action that resolves it.
- CW-004.M2: Distinguish "no data yet", "no matches" and "unavailable" in copy.

## SHOULD
- CW-004.S1: Use demo data only when clearly labeled and isolated.
- CW-004.S2: Keep empty-state copy under ~2 lines plus one primary action.

## AVOID
- CW-004.A1: Do not show fake zeros or imply records exist.
- CW-004.A2: Do not reuse the same copy for every empty cause.

## DECIDE
| Situation | Decision |
|---|---|
| First use | Explain value and provide a create action |
| Filtered empty | Show active filters and a clear-filters action |
| No permission | Explain access and the request path |
| Unavailable | State cause and offer retry or support |

## STATES
- First use
- Filtered empty
- No records
- No permission
- Unavailable
- Error

## EXAMPLE
Good: "No invoices match these filters" with "Clear filters". Bad: Blank list with no reason or action.

## FAILURE MODES
- Blank screens read as broken or loading.
- Fake zeros mislead decisions and reporting.
- Generic copy hides the fix the user needs.
- Demo data mixed with production corrupts metrics.

## CHECK
- [ ] Reason accurate?
- [ ] Action matches reason?
- [ ] Demo data labeled?
- [ ] Cause-specific copy?

## SOURCE NOTES
- [NN/g Empty State Interface Design](https://www.nngroup.com/articles/empty-state-interface-design/) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design Empty States](https://m2.material.io/design/communication/empty-states.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `CW-001` — retrieve when the feature crosses into this topic.
- `SAAS-008` — retrieve when the feature crosses into this topic.
- `INT-005` — retrieve when the feature crosses into this topic.
- `A11Y-007` — retrieve when the feature crosses into this topic.