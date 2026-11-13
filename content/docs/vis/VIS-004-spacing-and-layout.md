---
id: VIS-004
title: "Spacing and Layout"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [spacing-and-layout, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-005, DS-002]
sources:
  - name: "Apple HIG Layout"
    url: "https://developer.apple.com/design/human-interface-guidelines/layout"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-12
---

# VIS-004 — Spacing and Layout

## Summary
Spacing expresses relationships and creates scan rhythm.

## MUST
- VIS-004.M1: Use a documented spacing scale; separate groups more than items within a group.

## SHOULD
- VIS-004.S1: Adapt page gutters and columns to content and viewport.

## AVOID
- VIS-004.A1: Do not invent one-off gaps for every component.

## DECIDE
| Situation | Decision |
|---|---|
| High priority | Strongest coherent signal |
| Dense content | Optimize scanning before decoration |
| Responsive constraint | Reflow without losing meaning |

## STATES
- Default
- Responsive
- Long content
- Interactive states

## EXAMPLE
A label sits close to its input; the next field group has a larger gap.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Spacing tokens used?
- [ ] Grouping visible?
- [ ] No clipping on narrow widths?

## SOURCE NOTES
- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-005` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
