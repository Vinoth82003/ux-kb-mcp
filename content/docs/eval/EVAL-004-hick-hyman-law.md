---
id: EVAL-004
title: "Hick-Hyman Law"
domain: evaluation
group: M10
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, critique]
tags: [hick-hyman-law, evaluation]
applies_to: [web, mobile]
related: [CMP-003, CMP-007, CMP-006, CW-005]
sources:
  - name: "NN/g Hick's Law"
    url: "https://www.nngroup.com/articles/hick-law/"
updated: 2026-11-15
---

# EVAL-004 — Hick-Hyman Law

## Summary
Choice time tends to increase with number and uncertainty of choices; reduce unnecessary decision complexity.

## MUST
- EVAL-004.M1: Group choices by user goal and reveal secondary options progressively.

## SHOULD
- EVAL-004.S1: Keep comparable options visible when comparison matters.

## AVOID
- EVAL-004.A1: Do not hide essential choices or assume fewer options always better.

## DECIDE
| Situation | Decision |
|---|---|
| Many low-value options | Group/search/filter |
| Comparison task | Keep options visible |
| Expert workflow | Allow shortcuts and saved defaults |

## STATES
- First choice
- Comparison
- Filtering
- Confirmation
- Repeat use

## EXAMPLE
Good: Plan choice uses comparison table; 300 integrations use search. Bad: 300 integrations in one dropdown.

## FAILURE MODES
- Fewer options can remove needed control; validate against task goals.
- Grouping by vendor instead of user goal increases scanning; test findability.
- Search hides options without good metadata; ensure keywords and empty states.

## CHECK
- [ ] Choices map to goals?
- [ ] Search/grouping fit?
- [ ] Alternatives discoverable?

## SOURCE NOTES
- [NN/g Hick's Law](https://www.nngroup.com/articles/hick-law/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `CMP-003` — retrieve when the feature crosses into this topic.
- `CMP-007` — retrieve when the feature crosses into this topic.
- `CMP-006` — retrieve when the feature crosses into this topic.
- `CW-005` — retrieve when the feature crosses into this topic.