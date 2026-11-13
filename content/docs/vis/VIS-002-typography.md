---
id: VIS-002
title: "Typography"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [typography, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-004, DS-002]
sources:
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-12
---

# VIS-002 — Typography

## Summary
Typography is a system for reading, navigation and emphasis.

## MUST
- VIS-002.M1: Define semantic styles for page title, section, body, label, helper and metadata.

## SHOULD
- VIS-002.S1: Use relative sizing; test 200% zoom, long strings and localization.

## AVOID
- VIS-002.A1: Avoid thin weights for small text and uppercase as the only distinction.

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
A compact table may use smaller type than editorial body copy, but remains legible at zoom.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Type roles map to hierarchy?
- [ ] 200% zoom works?
- [ ] Line length and leading readable?

## SOURCE NOTES
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
