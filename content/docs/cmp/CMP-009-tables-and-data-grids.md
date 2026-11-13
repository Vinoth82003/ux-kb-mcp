---
id: CMP-009
title: "Tables and Data Grids"
domain: components
group: M03
type: pattern
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [tables-and-data-grids, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-005, INT-004, RSP-005]
sources:
  - name: "NN/g Data Tables"
    url: "https://www.nngroup.com/articles/data-tables/"
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-12
---

# CMP-009 — Tables and Data Grids

## Summary
Tables enable precise record comparison; grids add editing and keyboard complexity.

## MUST
- CMP-009.M1: Use semantic headers and accessible table name/caption; associate row and column headers.

## SHOULD
- CMP-009.S1: Align numeric values; expose sorting state and units.

## AVOID
- CMP-009.A1: Do not turn comparison data into cards when cross-row scanning matters.

## DECIDE
| Situation | Decision |
|---|---|
| Simple task | Use least complex semantic control |
| Custom behavior | Document keyboard/focus model |
| Mobile constraint | Preserve target size and labels |

## STATES
- Default
- Hover
- Focus
- Selected/active
- Disabled
- Loading
- Error
- Responsive

## EXAMPLE
Invoice table: Invoice, Due date, Amount, Status; amount right-aligned.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Headers associated?
- [ ] Sort state announced?
- [ ] Empty/loading/overflow handled?

## SOURCE NOTES
- [NN/g Data Tables](https://www.nngroup.com/articles/data-tables/) — authoritative reference; this document paraphrases relevant guidance.
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `RSP-005` — retrieve when the feature crosses into this topic.
