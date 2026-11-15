---
id: DS-005
title: "Component Variants"
domain: design_systems
group: M09
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [component-variants, design-systems]
applies_to: [web, mobile]
related: [DS-002, DS-003, DS-004, CMP-001]
sources:
  - name: "Material Design 3"
    url: "https://m3.material.io/"
  - name: "Radix UI"
    url: "https://www.radix-ui.com/"
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
updated: 2026-11-15
---

# DS-005 — Component Variants

## Summary
Variants express meaningful intent, hierarchy or state while keeping a predictable API.

## MUST
- DS-005.M1: Create variants for semantic roles such as primary, secondary, danger or quiet.
- DS-005.M2: Keep variant intent separate from state styling (hover, focus, disabled).

## SHOULD
- DS-005.S1: Constrain invalid variant/state combinations in the API.

## AVOID
- DS-005.A1: Do not create variants solely for arbitrary color, radius or page layout.
- DS-005.A2: Do not encode layout concerns (full-width) as variants.

## DECIDE
| Situation | Decision |
|---|---|
| Semantic role differs | New variant |
| Visual tweak only | Use token/prop, not variant |
| State styling | State layer, not variant |
| Layout concern | Layout prop or composition |

## STATES
- Variant
- State
- Default
- Disabled
- Invalid combination

## EXAMPLE
Good: "Danger is a variant; hover is a state; full-width is a layout prop." Bad: "A 'blue-large-rounded' variant."

## FAILURE MODES
- Variant sprawl from cosmetic preferences bloats APIs.
- Mixing state into variants makes theming and testing harder.
- Uncontrolled combinations produce inaccessible or broken UI.

## CHECK
- [ ] Use case named?
- [ ] State separate from variant?
- [ ] Invalid combos controlled?

## SOURCE NOTES
- [Material Design 3](https://m3.material.io/) — authoritative reference; this document paraphrases relevant guidance.
- [Radix UI](https://www.radix-ui.com/) — authoritative reference; this document paraphrases relevant guidance.
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `DS-002` — retrieve when the feature crosses into this topic.
- `DS-003` — retrieve when the feature crosses into this topic.
- `DS-004` — retrieve when the feature crosses into this topic.
- `CMP-001` — retrieve when the feature crosses into this topic.