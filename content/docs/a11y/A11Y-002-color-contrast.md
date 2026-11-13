---
id: A11Y-002
title: "Color Contrast"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 1
priority: core
stages: [audit, proposal, critique, implement]
tags: [color-contrast, accessibility]
applies_to: [web, mobile]
related: [VIS-006, INT-004, CMP-002, CMP-005]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "W3C WCAG 2.2 Quick Reference"
    url: "https://www.w3.org/WAI/WCAG22/quickref/"
  - name: "W3C Understanding Contrast Minimum"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum"
updated: 2026-11-12
---

# A11Y-002 — Color Contrast

## Summary
Text and non-text contrast use different criteria and must be measured in rendered combinations.

## MUST
- A11Y-002.M1: SC 1.4.3 AA: 4.5:1 normal text; 3:1 large text (>=24px regular or ~18.66px bold).

## SHOULD
- A11Y-002.S1: SC 1.4.11 AA: generally 3:1 for essential UI component boundaries and meaningful graphics.

## AVOID
- A11Y-002.A1: Do not apply 3:1 large-text threshold to normal 16px text.

## DECIDE
| Situation | Decision |
|---|---|
| Native element fits | Use native semantics |
| Custom widget needed | Follow pattern and test |
| Scan passes | Continue manual review |

## STATES
- Default
- Keyboard
- Screen reader
- Zoom/reflow
- Error
- High contrast/reduced motion

## EXAMPLE
Chart series need sufficient non-text contrast or redundant encoding.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Normal >=4.5:1?
- [ ] Large >=3:1?
- [ ] UI graphics >=3:1?
- [ ] States measured?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-006` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `CMP-005` — retrieve when the feature crosses into this topic.
