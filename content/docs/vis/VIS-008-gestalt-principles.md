---
id: VIS-008
title: "Gestalt Principles"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [gestalt-principles, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-004, DS-002]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-12
---

# VIS-008 — Gestalt Principles

## Summary
Proximity, similarity, continuity and common region shape perceived relationships.

## MUST
- VIS-008.M1: Use proximity to group labels and controls; similarity for same-function elements.

## SHOULD
- VIS-008.S1: Use a boundary when proximity alone is ambiguous.

## AVOID
- VIS-008.A1: Do not style different behaviors identically.

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
Field label, input and error form one perceived group.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Perceived groups match semantics?
- [ ] Similar styling means similar behavior?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
