---
id: DS-003
title: "Component Libraries"
domain: design_systems
group: M09
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [component-libraries, design-systems]
applies_to: [web, mobile]
related: [DS-001, DS-005, DS-006, CMP-001]
sources:
  - name: "Storybook"
    url: "https://storybook.js.org/"
  - name: "Radix UI"
    url: "https://www.radix-ui.com/"
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
updated: 2026-11-15
---

# DS-003 — Component Libraries

## Summary
A component library provides reusable, tested behavior; reuse matters only when it fits the task.

## MUST
- DS-003.M1: Document API, anatomy, variants, states and accessibility behavior for each component.
- DS-003.M2: Provide usage and non-usage guidance plus keyboard and screen-reader behavior.

## SHOULD
- DS-003.S1: Test components in realistic content, responsive contexts and with assistive tech.

## AVOID
- DS-003.A1: Do not create variants for one-off preferences or force unrelated patterns together.
- DS-003.A2: Do not ship a component without tests for loading, error and empty states.

## DECIDE
| Situation | Decision |
|---|---|
| Repeated UI need across teams | Add to library with owner |
| One-off or experimental | Keep local with documented rationale |
| Breaking component change | Major version + migration guide |
| Deprecated component | Keep for one release with warning |

## STATES
- Stable
- Beta
- Deprecated
- Removed
- Documented
- Tested

## EXAMPLE
Good: "Button owns focus, loading and disabled behavior; page owns composition." Bad: "A styled div passed off as a button with no keyboard support."

## FAILURE MODES
- Undocumented APIs lead to misuse and inconsistent behavior.
- Components tested only in isolation fail with real content.
- Variant sprawl recreates one-offs inside the library.

## CHECK
- [ ] Behavior documented?
- [ ] Variants semantic?
- [ ] Consumer context tested?
- [ ] Accessibility behavior specified?

## SOURCE NOTES
- [Storybook](https://storybook.js.org/) — authoritative reference; this document paraphrases relevant guidance.
- [Radix UI](https://www.radix-ui.com/) — authoritative reference; this document paraphrases relevant guidance.
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `DS-001` — retrieve when the feature crosses into this topic.
- `DS-005` — retrieve when the feature crosses into this topic.
- `DS-006` — retrieve when the feature crosses into this topic.
- `CMP-001` — retrieve when the feature crosses into this topic.