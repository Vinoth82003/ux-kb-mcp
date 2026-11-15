---
id: VIS-003
title: "Color Theory"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 2
priority: core
stages: [proposal, critique, implement]
tags: [color-theory, visual-design]
applies_to: [web, mobile]
related: [VIS-006, A11Y-002, DS-002, VIS-001]
sources:
  - name: "Material Design 3 Color"
    url: "https://m3.material.io/styles/color/overview"
  - name: "W3C WCAG 2.2 Use of Color"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
  - name: "MDN CSS Color"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color"
updated: 2026-11-15
---

# VIS-003 — Color Theory

## Summary
Color encodes brand, hierarchy and status; semantic consistency and perception matter more than palette novelty.

## MUST
- VIS-003.M1: Define semantic color tokens for text, surface, action, border and status (success, warning, error, info).
- VIS-003.M2: Never communicate status or selection through color alone; add text, icon or shape (see A11Y-002).
- VIS-003.M3: Pair colors by lightness difference, not hue alone, so distinctions survive grayscale and color blindness.

## SHOULD
- VIS-003.S1: Test light/dark and increased-contrast themes; remap tokens rather than invert.
- VIS-003.S2: Use perceptually uniform spaces (e.g., OKLCH/LCH) when deriving tints and shades.
- VIS-003.S3: Limit chromatic accents to meaningful roles; keep neutrals for structure.

## AVOID
- VIS-003.A1: Color-only status indicators or selection states.
- VIS-003.A2: Low lightness difference between adjacent semantic colors (e.g., two blues differing only in hue).
- VIS-003.A3: Assuming dark mode passes by inverting light-mode values.

## DECIDE
| Situation | Decision |
|---|---|
| Status color | Pair with icon/text; ensure grayscale distinction |
| Dark mode | Remap semantic tokens; re-measure (A11Y-002) |
| Chart series | Use color + pattern/shape + direct labels |
| Brand accent | Reserve for primary actions and key states |

## STATES
- Light theme
- Dark theme
- Increased contrast
- Disabled
- Status (success/warning/error/info)
- Data visualization

## EXAMPLE
Good: "Error state uses red icon + 'Error' text + red border; passes grayscale." Bad: "Status shown only by red vs green dots."

## FAILURE MODES
- Color-only cues fail for color-blind users.
- Inverted dark-mode palettes drop below contrast thresholds.
- Hue-only distinctions collapse in grayscale or print.
- Overuse of accent colors dilutes hierarchy.

## CHECK
- [ ] Semantic roles defined?
- [ ] Color not sole signal?
- [ ] Light/dark/contrast tested?
- [ ] Grayscale distinction preserved?

## SOURCE NOTES
- [Material Design 3 Color](https://m3.material.io/styles/color/overview) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) — authoritative reference; this document paraphrases relevant guidance.
- [MDN CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-006` — retrieve when the feature crosses into this topic.
- `A11Y-002` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
- `VIS-001` — retrieve when the feature crosses into this topic.