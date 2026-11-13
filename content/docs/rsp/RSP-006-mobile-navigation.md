---
id: RSP-006
title: "Mobile Navigation"
domain: responsive
group: M05
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [mobile-navigation, responsive]
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

# RSP-006 — Mobile Navigation

## Summary
Mobile navigation must expose location, destinations and backtracking without consuming the task area.

## MUST
- RSP-006.M1: Keep current location visible and provide consistent access to top-level destinations.

## SHOULD
- RSP-006.S1: Use bottom nav for a small set of high-frequency destinations only.

## AVOID
- RSP-006.A1: Do not hide sections behind unlabeled icons or rely on browser Back alone.

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
A four-step task shows Step 2 of 4 and a Back action.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Current section clear?
- [ ] Labels understandable?
- [ ] Back preserves input?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `CMP-006` — retrieve when the feature crosses into this topic.
