---
id: EVAL-005
title: "Gestalt Evaluation"
domain: evaluation
group: M10
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, critique]
tags: [gestalt-evaluation, evaluation]
applies_to: [web, mobile]
related: [VIS-008, VIS-001, VIS-004, DS-004]
sources:
  - name: "Interaction Design Foundation Gestalt Principles"
    url: "https://www.interaction-design.org/literature/topics/gestalt-principles"
  - name: "NN/g Proximity: Gestalt Principle"
    url: "https://www.nngroup.com/articles/gestalt-proximity"
updated: 2026-11-15
---

# EVAL-005 — Gestalt Evaluation

## Summary
Gestalt evaluation checks whether perceived grouping and continuity communicate intended information architecture; principles and definitions live in VIS-008.

## MUST
- EVAL-005.M1: Compare perceived groups with semantic relationships and interaction boundaries.

## SHOULD
- EVAL-005.S1: Apply VIS-008 principles (proximity, similarity, continuity, common region) deliberately; cite VIS-008 for definitions.

## AVOID
- EVAL-005.A1: Do not group unrelated controls just because they share a card.

## DECIDE
| Situation | Decision |
|---|---|
| Ambiguous grouping | Add boundary or spacing per VIS-008 |
| Dense form | Group by task, not layout convenience |
| Responsive reflow | Preserve perceived relationships |

## STATES
- Default
- Dense content
- Responsive
- Interactive states
- Error states

## EXAMPLE
Good: Label, input and error form one perceived group. Bad: Card groups submit button with unrelated settings.

## FAILURE MODES
- Visual grouping can imply false hierarchy; verify with task scanning.
- Consistent styling across different behaviors causes misclicks; differentiate roles.
- Responsive reflow can break grouping; re-check at narrow widths.

## CHECK
- [ ] Groups match task?
- [ ] Similar visuals mean similar roles?
- [ ] Reflow preserves grouping?

## SOURCE NOTES
- [Interaction Design Foundation Gestalt Principles](https://www.interaction-design.org/literature/topics/gestalt-principles) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Proximity: Gestalt Principle](https://www.nngroup.com/articles/gestalt-proximity) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-008` — retrieve when the feature crosses into this topic.
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-004` — retrieve when the feature crosses into this topic.