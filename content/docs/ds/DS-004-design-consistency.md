---
id: DS-004
title: "Design Consistency"
domain: design_systems
group: M09
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [design-consistency, design-systems]
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

# DS-004 — Design Consistency

## Summary
Consistency reduces relearning when same patterns mean and behave the same.

## MUST
- DS-004.M1: Use same label, treatment and interaction for same action unless justified.

## SHOULD
- DS-004.S1: Audit divergent behavior across repeated flows, not only pixels.

## AVOID
- DS-004.A1: Do not standardize a pattern proven wrong for a task.

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
Destructive actions share danger semantics and confirmation language.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Same action same meaning?
- [ ] Exceptions justified?
- [ ] Cross-screen checked?

## SOURCE NOTES
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design 3](https://m3.material.io/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-003` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `CMP-001` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
