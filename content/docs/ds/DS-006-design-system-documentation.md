---
id: DS-006
title: "Design System Documentation"
domain: design_systems
group: M09
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [design-system-documentation, design-systems]
applies_to: [web, mobile]
related: [DS-001, DS-003, EVAL-007, UX-005]
sources:
  - name: "Storybook"
    url: "https://storybook.js.org/"
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
  - name: "Diátaxis"
    url: "https://diataxis.fr/"
updated: 2026-11-15
---

# DS-006 — Design System Documentation

## Summary
Documentation enables correct selection, composition, implementation and contribution.

## MUST
- DS-006.M1: Document purpose, use/non-use, anatomy, variants, states, accessibility and examples.
- DS-006.M2: Include keyboard interaction, focus behavior and screen-reader expectations.

## SHOULD
- DS-006.S1: Include known limitations, version and migration guidance.

## AVOID
- DS-006.A1: Do not publish screenshots without behavior and implementation guidance.
- DS-006.A2: Do not document a component without its non-use cases.

## DECIDE
| Situation | Decision |
|---|---|
| Stable component | Full docs required |
| Experimental | Mark beta and limit claims |
| Breaking change | Migration note in docs and changelog |
| Deprecated | Keep docs with removal date |

## STATES
- Draft
- Reviewed
- Published
- Deprecated
- Removed

## EXAMPLE
Good: "Modal docs include focus entry, Escape and restoration—not just appearance." Bad: "A screenshot gallery with no API or behavior."

## FAILURE MODES
- Screenshot-only docs cause implementation drift.
- Missing non-use guidance leads to misuse.
- Undocumented breaking changes break consumers.

## CHECK
- [ ] Usage and non-use guidance?
- [ ] States and keyboard documented?
- [ ] Version and migration clear?

## SOURCE NOTES
- [Storybook](https://storybook.js.org/) — authoritative reference; this document paraphrases relevant guidance.
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.
- [Diátaxis](https://diataxis.fr/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `DS-001` — retrieve when the feature crosses into this topic.
- `DS-003` — retrieve when the feature crosses into this topic.
- `EVAL-007` — retrieve when the feature crosses into this topic.
- `UX-005` — retrieve when the feature crosses into this topic.