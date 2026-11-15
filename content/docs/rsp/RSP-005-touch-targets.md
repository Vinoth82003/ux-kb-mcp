---
id: RSP-005
title: "Touch Targets"
domain: responsive
group: M05
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [touch-targets, responsive]
applies_to: [web, mobile]
related: [A11Y-001, A11Y-003, EVAL-003, CMP-001]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "Apple HIG Layout"
    url: "https://developer.apple.com/design/human-interface-guidelines/layout"
  - name: "Material Design Accessibility"
    url: "https://m3.material.io/foundations/accessible-design/accessibility-basics"
updated: 2026-11-15
---

# RSP-005 — Touch Targets

## Summary
Touch target size reduces accidental activation and supports limited precision; meet WCAG 2.2 AA SC 2.5.8 (24×24 CSS px) and aim higher for comfort.

## MUST
- RSP-005.M1: Meet WCAG 2.2 AA SC 2.5.8: at least 24×24 CSS px unless an exception applies.

## SHOULD
- RSP-005.S1: Aim for 44–48 CSS px for important controls where space allows; this is comfort guidance, not WCAG AA minimum.

## AVOID
- RSP-005.A1: Do not cluster undersized targets or make tiny icons the only action.

## DECIDE
| Situation | Decision |
|---|---|
| Dense toolbar | Increase separation or size |
| Important control | Aim 44–48 CSS px |
| Exception applies | Document justification |
| Touch input | Follow WCAG 24×24 CSS px |

## STATES
- Pointer
- Touch
- Dense layout
- Disabled
- Focus visible
- Error

## EXAMPLE
Good: "A 16px icon sits inside a 44px hit area; visible glyph size is not target size." Bad: "A 16px icon with no hit area is the only delete action."

## FAILURE MODES
- Undersized targets cause accidental activation and fatigue.
- Clustered targets make precise selection impossible.
- Conflating glyph size with hit area hides WCAG failure.
- Exceptions undocumented; conformance overstated.

## CHECK
- [ ] 24×24 or exception?
- [ ] Adjacent targets separated?
- [ ] Important controls comfortable?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design Accessibility](https://m3.material.io/foundations/accessible-design/accessibility-basics) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `EVAL-003` — retrieve when the feature crosses into this topic.
- `CMP-001` — retrieve when the feature crosses into this topic.