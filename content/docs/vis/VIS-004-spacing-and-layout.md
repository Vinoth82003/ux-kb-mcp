---
id: VIS-004
title: "Spacing and Layout"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 2
priority: core
stages: [proposal, critique, implement]
tags: [spacing-and-layout, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-005, VIS-008, RSP-003, DS-002]
sources:
  - name: "Material Design 3 Layout"
    url: "https://m3.material.io/foundations/layout/understanding-layout/overview"
  - name: "W3C WCAG 2.2 Reflow"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
  - name: "MDN CSS Layout"
    url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout"
updated: 2026-11-15
---

# VIS-004 — Spacing and Layout

## Summary
Spacing expresses relationships and creates scan rhythm through a documented scale.

## MUST
- VIS-004.M1: Use a documented spacing scale; separate groups more than items within a group.
- VIS-004.M2: Use a 4px base scale: 0, 4, 8, 12, 16, 24, 32, 48, 64, 96 (px) (or rem equivalents); never one-off gaps.
- VIS-004.M3: Keep within-group gap smaller than between-group gap (e.g., 8-12px inside, 24-32px between).

## SHOULD
- VIS-004.S1: Adapt page gutters and columns to content and viewport (e.g., 16px mobile, 24px tablet, 32px desktop).
- VIS-004.S2: Cap content measure around 1200-1280px; use fluid widths below.
- VIS-004.S3: Preserve grouping and avoid clipping at narrow widths and 200% zoom (WCAG 1.4.10).

## AVOID
- VIS-004.A1: Do not invent one-off gaps for every component.
- VIS-004.A2: Equal spacing that erases grouping.
- VIS-004.A3: Horizontal scroll for primary content at 320px width.

## DECIDE
| Situation | Decision |
|---|---|
| Within component | 4-12px between related items |
| Between groups | 24-32px (or 2x within) |
| Page gutter | 16/24/32 by breakpoint |
| Dense data | 8-16px row gaps, align to grid |

## STATES
- Default
- Narrow/mobile
- Wide/desktop
- Zoom/reflow
- Dense content
- Empty

## EXAMPLE
Good: "Label 4px from input; 24px to next field group." Bad: "Every element separated by 16px regardless of relationship."

## FAILURE MODES
- Equal spacing hides grouping and increases scan time.
- One-off gaps break consistency and theming.
- Fixed gutters cause clipping on narrow screens.
- Reflow can collapse groups; re-check at 320px.

## CHECK
- [ ] Spacing tokens used?
- [ ] Grouping visible?
- [ ] No clipping on narrow widths?
- [ ] Within < between gap?

## SOURCE NOTES
- [Material Design 3 Layout](https://m3.material.io/foundations/layout/understanding-layout/overview) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — authoritative reference; this document paraphrases relevant guidance.
- [MDN CSS Layout](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-005` — retrieve when the feature crosses into this topic.
- `VIS-008` — retrieve when the feature crosses into this topic.
- `RSP-003` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.