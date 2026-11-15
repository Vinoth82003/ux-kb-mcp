---
id: CMP-009
title: "Tables and Data Grids"
domain: components
group: M03
type: pattern
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [tables-and-data-grids, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-005, SAAS-002, INT-004]
sources:
  - name: "NN/g Data Tables"
    url: "https://www.nngroup.com/articles/data-tables/"
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-15
---

# CMP-009 — Tables and Data Grids

## Summary
Tables enable precise record comparison; grids add editing and keyboard complexity.

## MUST
- CMP-009.M1: Use semantic headers (`<th scope>`) and an accessible table name/caption; associate row and column headers.
- CMP-009.M2: Provide keyboard operability for sortable headers (button + aria-sort) and focusable interactive cells.
- CMP-009.M3: Handle empty, loading and overflow states; do not trap horizontal scroll.

## SHOULD
- CMP-009.S1: Align numeric values; expose sorting state and units; use tabular figures.
- CMP-009.S2: Prefer a real table for comparison data; paginate or virtualize large sets.

## AVOID
- CMP-009.A1: Do not turn comparison data into cards when cross-row scanning matters.
- CMP-009.A2: Do not use layout tables for data or div-soup for tabular data.

## DECIDE
| Situation | Decision |
|---|---|
| Read-only comparison | Semantic table with caption |
| Sortable column | Button header + aria-sort |
| Large dataset | Pagination/virtualization + caption |
| Mobile | Horizontal scroll container or careful card fallback |

## STATES
- Default
- Hover
- Focus
- Sorted
- Loading
- Empty
- Error
- Responsive

## EXAMPLE
Good: Invoice table: Invoice, Due date, Amount, Status; amount right-aligned; sortable Amount header announces sort. Bad: card grid for invoice comparison.

## FAILURE MODES
- Div-based tables lose header association and assistive-tech navigation.
- Unannounced sort state confuses screen-reader users.
- Horizontal overflow without a scroll affordance hides data on mobile.

## CHECK
- [ ] Headers associated?
- [ ] Sort state announced?
- [ ] Empty/loading/overflow handled?
- [ ] Keyboard operable?

## SOURCE NOTES
- [NN/g Data Tables](https://www.nngroup.com/articles/data-tables/) — authoritative reference; this document paraphrases relevant guidance.
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `SAAS-002` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.