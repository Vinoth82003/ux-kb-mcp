---
id: VIS-009
title: "Iconography"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [iconography, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-004, DS-002]
sources:
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-12
---

# VIS-009 — Iconography

## Summary
Icons are a compact visual language; ambiguity and missing accessible names cause failures.

## MUST
- VIS-009.M1: Use one coherent icon family and provide accessible names for icon-only controls.

## SHOULD
- VIS-009.S1: Pair unfamiliar or high-impact actions with visible text.

## AVOID
- VIS-009.A1: Do not use emoji as product icons or invent obscure metaphors.

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
Use “Archive project” rather than an unlabeled box icon.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Meaning unambiguous?
- [ ] Family consistent?
- [ ] Accessible name present?

## SOURCE NOTES
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
