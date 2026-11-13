---
id: CMP-004
title: "Cards"
domain: components
group: M03
type: pattern
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [cards, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-005, INT-004, RSP-005]
sources:
  - name: "Material Design 3"
    url: "https://m3.material.io/"
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-12
---

# CMP-004 — Cards

## Summary
Cards group a coherent unit of content or action; they are not a default layout primitive.

## MUST
- CMP-004.M1: Use a card only when content has a meaningful boundary or independent scan unit.

## SHOULD
- CMP-004.S1: Make a whole card clickable only with one dominant destination and no competing nested actions.

## AVOID
- CMP-004.A1: Do not put every paragraph in a card or use grids without content rationale.

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
Project card groups name, status, owner and one Open action.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Boundary signals real group?
- [ ] Click target unambiguous?
- [ ] Mobile order logical?

## SOURCE NOTES
- [Material Design 3](https://m3.material.io/) — authoritative reference; this document paraphrases relevant guidance.
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `RSP-005` — retrieve when the feature crosses into this topic.
