---
id: VIS-001
title: "Visual Hierarchy"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [visual-hierarchy, visual-design]
applies_to: [web, mobile]
related: [VIS-002, VIS-004, DS-002]
sources:
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
updated: 2026-11-12
---

# VIS-001 — Visual Hierarchy

## Summary
Hierarchy makes the next useful action and relationships among content levels perceptible.

## MUST
- VIS-001.M1: Use size, weight, position, contrast and whitespace together; do not rely on size alone.

## SHOULD
- VIS-001.S1: Give the page one dominant heading and one primary action; subordinate supporting content.

## AVOID
- VIS-001.A1: If two elements compete, reduce one or restructure the task.

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
Dashboard: KPI value > label > comparison period > note.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Primary task apparent quickly?
- [ ] Heading order semantic?
- [ ] Secondary actions subordinate?

## SOURCE NOTES
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-002` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
