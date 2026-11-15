---
id: DS-001
title: "Design System Architecture"
domain: design_systems
group: M09
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [design-system-architecture, design-systems]
applies_to: [web, mobile]
related: [DS-002, DS-003, DS-006, CMP-001]
sources:
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
  - name: "Material Design 3"
    url: "https://m3.material.io/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-15
---

# DS-001 — Design System Architecture

## Summary
A design system connects principles, tokens, components, patterns, documentation and governance into one evolvable product.

## MUST
- DS-001.M1: Separate foundations (tokens), components and task-level patterns into distinct layers with documented boundaries.
- DS-001.M2: Define ownership, contribution, review, release and deprecation paths before publishing components.

## SHOULD
- DS-001.S1: Version the system with semver and publish migration notes for breaking changes.

## AVOID
- DS-001.A1: Do not treat a component catalogue without usage guidance as a complete system.
- DS-001.A2: Do not let application teams fork components without a contribution path.

## DECIDE
| Situation | Decision |
|---|---|
| Repeated decision across 2+ products | Promote to token/component |
| Unique workflow or one-off | Keep as pattern/page-level solution |
| Breaking API or visual change | Major version + migration note |
| Deprecated component | Keep for one release cycle with warning |

## STATES
- Foundations
- Components
- Patterns
- Documentation
- Governance
- Deprecated

## EXAMPLE
Good: "Date picker is a component; invoice creation flow is a pattern composing it." Bad: "A Figma component library with no code, docs or owner called a design system."

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- Systems without ownership decay into inconsistent forks.
- Treating a catalogue as complete skips usage and accessibility guidance.

## CHECK
- [ ] Layers and owners clear?
- [ ] Contribution and review path exists?
- [ ] Pattern distinct from component?
- [ ] Versioning and deprecation documented?

## SOURCE NOTES
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design 3](https://m3.material.io/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `DS-002` — retrieve when the feature crosses into this topic.
- `DS-003` — retrieve when the feature crosses into this topic.
- `DS-006` — retrieve when the feature crosses into this topic.
- `CMP-001` — retrieve when the feature crosses into this topic.