---
id: VIS-003
title: "Color Theory"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [color-theory, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-004, DS-002]
sources:
  - name: "Apple HIG Color"
    url: "https://developer.apple.com/design/human-interface-guidelines/color"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-12
---

# VIS-003 — Color Theory

## Summary
Color encodes brand, hierarchy and status; semantic consistency and perception matter more than palette novelty.

## MUST
- VIS-003.M1: Define semantic tokens for text, surface, action, border and status.

## SHOULD
- VIS-003.S1: Test light/dark and increased-contrast contexts where supported.

## AVOID
- VIS-003.A1: Never communicate status or selection through color alone.

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
Red/green chart series also use labels, shape or pattern.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Semantic roles defined?
- [ ] Color not sole signal?
- [ ] Contrast tested?

## SOURCE NOTES
- [Apple HIG Color](https://developer.apple.com/design/human-interface-guidelines/color) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
