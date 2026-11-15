---
id: VIS-007
title: "Balance and Proportion"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [balance-and-proportion, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-004, VIS-005, DS-002]
sources:
  - name: "Nielsen Norman Group Visual Hierarchy"
    url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/"
  - name: "Material Design 3 Layout"
    url: "https://m3.material.io/foundations/layout/understanding-layout/overview"
  - name: "MDN CSS Layout"
    url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout"
updated: 2026-11-15
---

# VIS-007 — Balance and Proportion

## Summary
Balance distributes visual weight by task importance; symmetry is optional and decoration must not drive layout.

## MUST
- VIS-007.M1: Allocate visual weight (size, color saturation, density, position) to critical information and actions first.
- VIS-007.M2: Use whitespace to isolate high-priority content; keep decorative elements subordinate in weight.

## SHOULD
- VIS-007.S1: Prefer asymmetric layouts when tasks have unequal importance; align all blocks to the grid.
- VIS-007.S2: Keep primary content within a consistent measure (e.g., 60-75% of viewport) and secondary in the remainder.
- VIS-007.S3: Rebalance at breakpoints rather than forcing equal columns.

## AVOID
- VIS-007.A1: Adding panels or cards solely to make columns look balanced.
- VIS-007.A2: Centering everything, which flattens priority.
- VIS-007.A3: Decorative imagery or color blocks heavier than task content.

## DECIDE
| Situation | Decision |
|---|---|
| Unequal importance | Give larger share to primary task |
| Empty secondary column | Remove or collapse, do not pad |
| Dense dashboard | Primary region dominates; KPIs subordinate |
| Marketing hero | Visual weight supports headline + CTA |

## STATES
- Default
- Dense content
- Responsive
- Empty/secondary empty
- Loading

## EXAMPLE
Good: "Operational queue takes 70% width; KPI tiles stack in 30% sidebar." Bad: "Two equal columns where one holds a single button."

## FAILURE MODES
- Equal columns imply equal importance and dilute focus.
- Decorative panels add noise without task value.
- Responsive reflow can leave empty, padded regions.
- Visual weight misaligned with task priority slows decisions.

## CHECK
- [ ] Visual weight matches task?
- [ ] Density intentional?
- [ ] Decoration subordinate?
- [ ] No padding panels?

## SOURCE NOTES
- [Nielsen Norman Group Visual Hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design 3 Layout](https://m3.material.io/foundations/layout/understanding-layout/overview) — authoritative reference; this document paraphrases relevant guidance.
- [MDN CSS Layout](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `VIS-005` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.