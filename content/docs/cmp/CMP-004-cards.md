---
id: CMP-004
title: "Cards"
domain: components
group: M03
type: pattern
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [cards, components]
applies_to: [web, mobile]
related: [VIS-004, VIS-008, A11Y-005, DS-004]
sources:
  - name: "Material Design 3"
    url: "https://m3.material.io/"
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-15
---

# CMP-004 — Cards

## Summary
Cards group a coherent unit of content or action; they are not a default layout primitive.

## MUST
- CMP-004.M1: Use a card only when content has a meaningful boundary or independent scan unit.
- CMP-004.M2: If the whole card is clickable, provide one dominant destination and an accessible name; avoid competing nested actions.
- CMP-004.M3: Preserve semantic structure (heading, list, etc.) inside the card; do not rely on card chrome alone.

## SHOULD
- CMP-004.S1: Keep nested actions clearly separated and keyboard-focusable; provide hover/focus affordance.
- CMP-004.S2: Use consistent spacing and elevation tokens from the design system.

## AVOID
- CMP-004.A1: Do not put every paragraph in a card or use grids without content rationale.
- CMP-004.A2: Do not nest multiple competing click targets in one card.

## DECIDE
| Situation | Decision |
|---|---|
| Coherent unit | Card with heading + summary + action |
| Multiple actions | Card container + separate action buttons |
| List of records | Table/list, not card grid |
| Marketing grid | Only when content relationships justify |

## STATES
- Default
- Hover
- Focus
- Selected
- Loading
- Empty
- Error
- Responsive

## EXAMPLE
Good: Project card groups name, status, owner and one Open action. Bad: every paragraph wrapped in a card in a three-column grid.

## FAILURE MODES
- Card grids without content rationale create visual noise and scanning cost.
- Whole-card clicks with nested actions cause accidental navigation.
- Missing semantics make card content hard to navigate for assistive tech.

## CHECK
- [ ] Boundary signals real group?
- [ ] Click target unambiguous?
- [ ] Mobile order logical?
- [ ] Semantics preserved?

## SOURCE NOTES
- [Material Design 3](https://m3.material.io/) — authoritative reference; this document paraphrases relevant guidance.
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-004` — retrieve when the feature crosses into this topic.
- `VIS-008` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `DS-004` — retrieve when the feature crosses into this topic.