---
id: VIS-006
title: "Contrast and Readability"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [contrast-and-readability, visual-design]
applies_to: [web, mobile]
related: [A11Y-002, DS-002]
sources:
  - name: "W3C Understanding Contrast Minimum"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-12
---

# VIS-006 — Contrast and Readability

## Summary
Readable UI requires sufficient text, non-text and focus contrast in rendered states.

## MUST
- VIS-006.M1: Meet AA text contrast: 4.5:1 normal, 3:1 large; meaningful UI boundaries/graphics generally 3:1.

## SHOULD
- VIS-006.S1: Measure hover, focus, placeholder, overlay and dark-mode states.

## AVOID
- VIS-006.A1: Do not use pale text for essential information or subtle borders as the only control boundary.

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
A low-contrast placeholder is still text and needs sufficient contrast.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Normal text >=4.5:1?
- [ ] Large text >=3:1?
- [ ] UI graphics >=3:1 where required?
- [ ] States tested?

## SOURCE NOTES
- [W3C Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-002` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
