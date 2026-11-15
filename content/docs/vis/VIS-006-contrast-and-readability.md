---
id: VIS-006
title: "Contrast and Readability"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 2
priority: core
stages: [proposal, critique, implement]
tags: [contrast-and-readability, visual-design]
applies_to: [web, mobile]
related: [A11Y-002, VIS-003, DS-002]
sources:
  - name: "W3C WCAG 2.2 Contrast Minimum"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
  - name: "W3C WCAG 2.2 Non-text Contrast"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
  - name: "Material Design 3 Color"
    url: "https://m3.material.io/styles/color/overview"
updated: 2026-11-15
---

# VIS-006 — Contrast and Readability

## Summary
Visual contrast is about color relationships and pairing; measurable thresholds are owned by A11Y-002.

## MUST
- VIS-006.M1: Pair foreground and background by lightness difference, not hue alone; verify on real rendered backgrounds.
- VIS-006.M2: Provide a scrim or solid backing when text sits on images, gradients or video.
- VIS-006.M3: Defer threshold requirements to A11Y-002; this doc covers visual pairing and hierarchy, not numeric pass/fail.

## SHOULD
- VIS-006.S1: Test hover, focus, placeholder, disabled, overlay and dark-mode pairings for visual coherence.
- VIS-006.S2: Use distinct contrast between primary, secondary and disabled text tiers (e.g., 100/60/38% opacity on a surface).
- VIS-006.S3: Keep borders and dividers visible as structure, not as the only control boundary.

## AVOID
- VIS-006.A1: Pale text for essential information or subtle borders as the only boundary.
- VIS-006.A2: Assuming light-mode pairings transfer to dark mode.
- VIS-006.A3: Re-stating WCAG thresholds here (see A11Y-002).

## DECIDE
| Situation | Decision |
|---|---|
| Text on image | Add scrim/solid backing; verify pairing |
| Dark mode | Remap pairs; do not invert |
| Disabled state | Reduce prominence but keep readable |
| Secondary text | Use opacity tier, not a new hue |

## STATES
- Default
- Hover/focus
- Disabled
- Placeholder
- Dark mode
- On image/gradient

## EXAMPLE
Good: "Body text tier 100% opacity, secondary 60%, disabled 38%; scrim behind hero text." Bad: "Light gray body on white plus a faint border as the only input edge."

## FAILURE MODES
- Visual pairing that looks fine in mockups fails over real image content.
- Dark-mode pairs often lose separation between tiers.
- Disabled text becomes unreadable or indistinguishable from placeholder.
- Borders used as sole boundary disappear in low contrast.

## CHECK
- [ ] Foreground/background pairs by lightness?
- [ ] Scrim/solid backing on media?
- [ ] Text tiers distinct?
- [ ] Dark-mode pairs reviewed?
- [ ] Thresholds verified in A11Y-002?

## SOURCE NOTES
- [W3C WCAG 2.2 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) — authoritative reference; thresholds live in A11Y-002.
- [W3C WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design 3 Color](https://m3.material.io/styles/color/overview) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-002` — retrieve when the feature crosses into this topic.
- `VIS-003` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.