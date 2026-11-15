---
id: DS-002
title: "Design Tokens"
domain: design_systems
group: M09
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [design-tokens, design-systems]
applies_to: [web, mobile]
related: [VIS-003, VIS-004, DS-001, DS-005]
sources:
  - name: "W3C Design Tokens Community Group"
    url: "https://www.w3.org/community/design-tokens/"
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
  - name: "Material Design 3 Color System"
    url: "https://m3.material.io/styles/color/overview"
updated: 2026-11-15
---

# DS-002 — Design Tokens

## Summary
Tokens are named design decisions that let themes and components share consistent values across platforms.

## MUST
- DS-002.M1: Use semantic tokens for roles such as text-primary, surface-default and action-primary.
- DS-002.M2: Separate primitive palette/scale (color.blue.500) from semantic aliases (color.text.primary).
- DS-002.M3: Store tokens in a platform-neutral format and generate platform outputs from one source.

## SHOULD
- DS-002.S1: Include type, value, description and deprecation metadata for each token.

## AVOID
- DS-002.A1: Do not hardcode repeated values across components.
- DS-002.A2: Do not use primitive token names directly in component code.

## DECIDE
| Situation | Decision |
|---|---|
| New repeated value | Add primitive + semantic alias |
| Theme-specific value | Alias per theme, keep primitive stable |
| Renaming a token | Add alias, deprecate old for one cycle |
| Platform difference | Generate from same source, not hand-maintain |

## STATES
- Primitive
- Semantic alias
- Theme override
- Deprecated
- Removed

## EXAMPLE
Good: "Button uses color.action.primary which resolves to blue.600 in light and blue.400 in dark." Bad: "Button uses #2563EB hardcoded."

## FAILURE MODES
- Hardcoded values drift between themes and platforms.
- Primitive names in components block theming.
- Token sprawl without metadata makes deprecation unsafe.

## CHECK
- [ ] Semantic roles real and named by role?
- [ ] Primitives separated from aliases?
- [ ] Themes considered and measured?
- [ ] Platform outputs generated from one source?

## SOURCE NOTES
- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/) — authoritative reference; this document paraphrases relevant guidance.
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design 3 Color System](https://m3.material.io/styles/color/overview) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-003` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-001` — retrieve when the feature crosses into this topic.
- `DS-005` — retrieve when the feature crosses into this topic.