---
id: VIS-010
title: "Imagery and Illustration"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [imagery-and-illustration, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-004, DS-002]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-12
---

# VIS-010 — Imagery and Illustration

## Summary
Imagery should add task information, context or brand meaning.

## MUST
- VIS-010.M1: Use representative imagery; provide equivalent text for informative images.

## SHOULD
- VIS-010.S1: Use empty alt for purely decorative imagery.

## AVOID
- VIS-010.A1: Do not use stock imagery as fake evidence or filler.

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
Product image shows the exact purchasable variant.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Image supports task?
- [ ] Alt equivalent?
- [ ] Crop preserves meaning?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
