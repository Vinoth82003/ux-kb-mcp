---
id: A11Y-002
title: "Color Contrast"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [color-contrast, accessibility]
applies_to: [web, mobile]
related: [VIS-006, DS-002, CMP-001]
sources:
  - name: "W3C Understanding Contrast Minimum"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum"
  - name: "W3C Understanding Use of Color"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-15
---

# A11Y-002 — Color Contrast

## Summary
Text and non-text contrast thresholds differ by size and role; measure rendered combinations including states, dark mode and image backgrounds.

## MUST
- A11Y-002.M1: SC 1.4.3 AA: 4.5:1 normal text; 3:1 large text (>=24px regular or ~18.66px bold).
- A11Y-002.M2: SC 1.4.11 AA: 3:1 for essential UI component boundaries and meaningful graphics.
- A11Y-002.M3: SC 1.4.1: do not use color as the only means to convey information; add text, icon or shape redundancy.
- A11Y-002.M4: Measure contrast on actual rendered backgrounds, including images, gradients and overlays.

## SHOULD
- A11Y-002.S1: Test hover, focus, disabled, placeholder, error and dark-mode states.
- A11Y-002.S2: Prefer at least 4.5:1 for large text where feasible; avoid low-contrast placeholders for essential info.

## AVOID
- A11Y-002.A1: Do not apply the 3:1 large-text threshold to normal 16px text.
- A11Y-002.A2: Do not rely on subtle borders or pale text as the only control boundary.

## DECIDE
| Situation | Decision |
|---|---|
| Text on image/gradient | Add scrim or solid backing to meet threshold |
| Dark mode | Re-measure; do not invert and assume pass |
| Decorative graphic | No contrast requirement if not meaningful |

## STATES
- Default
- Hover/focus
- Disabled
- Placeholder
- Error
- Dark mode
- On image/gradient

## EXAMPLE
Good: "Body text on hero image reaches 4.5:1 after a 40% scrim." Bad: "White text over photo assumed readable."

## FAILURE MODES
- Contrast passes in design tool but fails over real image content.
- Dark-mode palettes often drop below threshold.
- Color-only status indicators fail for color-blind users.

## CHECK
- [ ] Normal text >=4.5:1?
- [ ] Large text >=3:1?
- [ ] UI graphics >=3:1?
- [ ] Color not sole cue?
- [ ] States/dark mode/image backgrounds measured?

## SOURCE NOTES
- [W3C Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) — authoritative reference; this document paraphrases relevant guidance.
- [W3C Understanding Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-006` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
- `CMP-001` — retrieve when the feature crosses into this topic.
