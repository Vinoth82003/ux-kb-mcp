---
id: DS-001
title: "Design System Architecture"
domain: design_systems
group: M09
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [design-system-architecture, design-systems]
applies_to: [web, mobile]
related: [VIS-003, VIS-004, CMP-001, A11Y-001]
sources:
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
  - name: "Material Design 3"
    url: "https://m3.material.io/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-12
---

# DS-001 — Design System Architecture

## Summary
A design system connects principles, tokens, components, patterns, documentation and governance.

## MUST
- DS-001.M1: Separate foundations, components and task-level patterns.

## SHOULD
- DS-001.S1: Define ownership, contribution, review, release and deprecation paths.

## AVOID
- DS-001.A1: Do not treat a component catalogue without usage guidance as a complete system.

## DECIDE
| Situation | Decision |
|---|---|
| Repeated decision | Promote token/component |
| Unique workflow | Keep as pattern |
| Breaking change | Version and migration note |

## STATES
- Default
- Variants
- States
- Theme
- Responsive
- Deprecated

## EXAMPLE
Date picker is component; invoice creation is a pattern.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Layers/owners clear?
- [ ] Contribution path exists?
- [ ] Pattern distinct from component?

## SOURCE NOTES
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design 3](https://m3.material.io/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-003` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `CMP-001` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
