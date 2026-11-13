---
id: VIS-007
title: "Balance and Proportion"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [balance-and-proportion, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-004, DS-002]
sources:
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "Apple HIG Layout"
    url: "https://developer.apple.com/design/human-interface-guidelines/layout"
updated: 2026-11-12
---

# VIS-007 — Balance and Proportion

## Summary
Balance distributes visual weight according to task importance; symmetry is not mandatory.

## MUST
- VIS-007.M1: Allocate visual weight to critical information and actions.

## SHOULD
- VIS-007.S1: Use whitespace to isolate high-priority content.

## AVOID
- VIS-007.A1: Do not add panels merely to make columns look balanced.

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
An operational queue may dominate secondary KPI tiles.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Visual weight matches task?
- [ ] Density intentional?
- [ ] Decoration subordinate?

## SOURCE NOTES
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
