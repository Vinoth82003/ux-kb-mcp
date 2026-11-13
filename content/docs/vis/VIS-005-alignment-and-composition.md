---
id: VIS-005
title: "Alignment and Composition"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [alignment-and-composition, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-004, DS-002]
sources:
  - name: "Apple HIG Layout"
    url: "https://developer.apple.com/design/human-interface-guidelines/layout"
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
updated: 2026-11-12
---

# VIS-005 — Alignment and Composition

## Summary
Alignment creates a shared structure that supports comparison and scanning.

## MUST
- VIS-005.M1: Align related labels, values and actions to deliberate edges.

## SHOULD
- VIS-005.S1: Align numeric columns by magnitude and units.

## AVOID
- VIS-005.A1: Do not center-align long body copy or dense data without a reason.

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
Invoice amounts right-aligned; row labels left-aligned.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Shared edges reinforce grouping?
- [ ] Numbers comparable?
- [ ] Responsive order preserved?

## SOURCE NOTES
- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — authoritative reference; this document paraphrases relevant guidance.
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
