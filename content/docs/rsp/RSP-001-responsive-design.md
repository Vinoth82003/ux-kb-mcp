---
id: RSP-001
title: "Responsive Design"
domain: responsive
group: M05
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [responsive-design, responsive]
applies_to: [web, mobile]
related: [A11Y-001, VIS-004, RSP-003, RSP-004]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "MDN Responsive web design"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design"
  - name: "web.dev Responsive design basics"
    url: "https://web.dev/responsive-web-design-basics/"
updated: 2026-11-15
---

# RSP-001 — Responsive Design

## Summary
Responsive design adapts layout, content and interaction to available space, input and zoom—not device names alone; meet WCAG 2.2 AA SC 1.4.10 reflow at 320 CSS px.

## MUST
- RSP-001.M1: Choose breakpoints where the current layout fails; test narrow widths, zoom and orientation.
- RSP-001.M2: Meet WCAG 2.2 AA SC 1.4.10 Reflow: content reflows without two-dimensional scrolling at 320 CSS px width (equivalent to 400% zoom at 1280 CSS px).

## SHOULD
- RSP-001.S1: Preserve task priority and content order across widths.
- RSP-001.S2: Use fluid grids, relative units and max-width so content adapts without horizontal scroll.

## AVOID
- RSP-001.A1: Do not shrink desktop columns until text and controls become unusable.
- RSP-001.A2: Do not rely on device-name breakpoints or horizontal scrolling for core tasks.

## DECIDE
| Situation | Decision |
|---|---|
| Layout fits | Keep fluid |
| Content collides | Add breakpoint |
| Reflow fails at 320 CSS px | Remove 2D scroll; restructure |
| Interaction changes | Test adaptive pattern |

## STATES
- Narrow (320 CSS px)
- Medium
- Wide
- Zoom/reflow
- Orientation
- Touch/keyboard

## EXAMPLE
Good: "Settings page reflows from two columns to one ordered column at 320 CSS px with no horizontal scroll." Bad: "Desktop table shrinks to 8px text and requires sideways scrolling to read."

## FAILURE MODES
- Fixed-width containers cause two-dimensional scrolling at 320 CSS px.
- Content order changes across widths hide primary tasks.
- Breakpoints chosen by device names break on in-between sizes.
- Zoom to 400% reveals clipped or overlapping controls.

## CHECK
- [ ] Reflows at 320 CSS px without 2D scroll?
- [ ] Breakpoints content-driven?
- [ ] No unintended page scroll?
- [ ] Content order preserved?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [MDN Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) — authoritative reference; this document paraphrases relevant guidance.
- [web.dev Responsive design basics](https://web.dev/responsive-web-design-basics/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `RSP-003` — retrieve when the feature crosses into this topic.
- `RSP-004` — retrieve when the feature crosses into this topic.