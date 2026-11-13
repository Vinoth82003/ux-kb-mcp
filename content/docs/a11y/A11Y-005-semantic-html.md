---
id: A11Y-005
title: "Semantic HTML"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 1
priority: core
stages: [audit, proposal, critique, implement]
tags: [semantic-html, accessibility]
applies_to: [web, mobile]
related: [VIS-006, INT-004, CMP-002, CMP-005]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "W3C WCAG 2.2 Quick Reference"
    url: "https://www.w3.org/WAI/WCAG22/quickref/"
  - name: "W3C Understanding Focus Appearance"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html"
updated: 2026-11-12
---

# A11Y-005 — Semantic HTML

## Summary
Semantic HTML supplies reliable browser and assistive technology behavior with less custom code.

## MUST
- A11Y-005.M1: Use native button, anchor, input, select, form, heading, list and table for their actual purpose.

## SHOULD
- A11Y-005.S1: Keep heading hierarchy logical and use landmarks for page regions.

## AVOID
- A11Y-005.A1: Do not use clickable divs as substitutes for native controls.

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
View invoice is a link; Download invoice is an action button.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Element matches behavior?
- [ ] Heading hierarchy logical?
- [ ] Native behavior preserved?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C Understanding Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-006` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `CMP-005` — retrieve when the feature crosses into this topic.
