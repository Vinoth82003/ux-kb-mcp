---
id: RSP-005
title: "Touch Targets"
domain: responsive
group: M05
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [touch-targets, responsive]
applies_to: [web, mobile]
related: [A11Y-001, A11Y-003, VIS-004, CMP-006]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "Apple HIG Layout"
    url: "https://developer.apple.com/design/human-interface-guidelines/layout"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-12
---

# RSP-005 — Touch Targets

## Summary
Touch target size reduces accidental activation and supports limited precision.

## MUST
- RSP-005.M1: Meet WCAG 2.2 AA SC 2.5.8: at least 24×24 CSS px unless an exception applies.

## SHOULD
- RSP-005.S1: Aim for 44–48 CSS px for important controls where space allows; this is comfort guidance, not WCAG AA minimum.

## AVOID
- RSP-005.A1: Do not cluster undersized targets or make tiny icons the only action.

## DECIDE
| Situation | Decision |
|---|---|
| Layout fits | Keep fluid |
| Content collides | Add breakpoint |
| Interaction changes | Test adaptive pattern |

## STATES
- Narrow
- Wide
- Zoom/reflow
- Orientation
- Touch/keyboard

## EXAMPLE
A 16px icon sits inside a 44px hit area; visible glyph size is not target size.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] 24×24 or exception?
- [ ] Adjacent targets separated?
- [ ] Important controls comfortable?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `CMP-006` — retrieve when the feature crosses into this topic.
