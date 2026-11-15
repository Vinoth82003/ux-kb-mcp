---
id: EVAL-002
title: "Cognitive Load"
domain: evaluation
group: M10
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, critique]
tags: [cognitive-load, evaluation]
applies_to: [web, mobile]
related: [UX-005, A11Y-007, CMP-002, CW-001]
sources:
  - name: "NN/g Minimize Cognitive Load"
    url: "https://www.nngroup.com/articles/minimize-cognitive-load/"
updated: 2026-11-15
---

# EVAL-002 — Cognitive Load

## Summary
Cognitive load is the mental effort needed to understand, compare and act; review minimizes avoidable working-memory, decision and interpretation burden.

## MUST
- EVAL-002.M1: Externalize information users must compare or remember (e.g., keep selected plan and billing cadence visible during checkout).

## SHOULD
- EVAL-002.S1: Group options and reveal complexity progressively without hiding essentials.

## AVOID
- EVAL-002.A1: Do not claim a universal maximum number of options.

## DECIDE
| Situation | Decision |
|---|---|
| Comparison across steps | Keep key values visible |
| Dense form | Chunk and label groups |
| Expert shortcut | Progressive disclosure with escape hatch |

## STATES
- First encounter
- Comparison
- Data entry
- Error/recovery
- Repeat use

## EXAMPLE
Good: Checkout shows selected plan, price and renewal date on every step. Bad: User must remember plan details from a previous page.

## FAILURE MODES
- Reducing visible options can increase load if labels become vague; test comprehension.
- Progressive disclosure that hides required fields causes rework; keep essentials visible.
- Memory aids such as tooltips add reading load; prefer inline clarity.

## CHECK
- [ ] Recall minimized?
- [ ] Comparison supported?
- [ ] Terms understandable?

## SOURCE NOTES
- [NN/g Minimize Cognitive Load](https://www.nngroup.com/articles/minimize-cognitive-load/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-005` — retrieve when the feature crosses into this topic.
- `A11Y-007` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `CW-001` — retrieve when the feature crosses into this topic.