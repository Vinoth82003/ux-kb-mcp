---
id: CMP-006
title: "Navigation Bars"
domain: components
group: M03
type: pattern
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [navigation-bars, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-005, INT-004, RSP-005]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-12
---

# CMP-006 — Navigation Bars

## Summary
Navigation expresses information architecture and current location.

## MUST
- CMP-006.M1: Use user vocabulary and group destinations by task.

## SHOULD
- CMP-006.S1: Indicate current location beyond color alone.

## AVOID
- CMP-006.A1: Do not overload primary navigation or use ambiguous labels.

## DECIDE
| Situation | Decision |
|---|---|
| Simple task | Use least complex semantic control |
| Custom behavior | Document keyboard/focus model |
| Mobile constraint | Preserve target size and labels |

## STATES
- Default
- Hover
- Focus
- Selected/active
- Disabled
- Loading
- Error
- Responsive

## EXAMPLE
Overview, Transactions, Reports, Settings rather than every report in top nav.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Labels recognizable?
- [ ] Current location perceivable?
- [ ] Keyboard/mobile usable?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `RSP-005` — retrieve when the feature crosses into this topic.
