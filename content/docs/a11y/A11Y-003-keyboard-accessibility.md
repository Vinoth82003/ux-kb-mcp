---
id: A11Y-003
title: "Keyboard Accessibility"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 1
priority: core
stages: [audit, proposal, critique, implement]
tags: [keyboard-accessibility, accessibility]
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

# A11Y-003 — Keyboard Accessibility

## Summary
All functionality must work by keyboard without traps, hidden focus or pointer-only gestures.

## MUST
- A11Y-003.M1: Support keyboard operation and no keyboard trap under WCAG 2.1.1/2.1.2.

## SHOULD
- A11Y-003.S1: Use native controls; implement expected arrow/Home/End/Escape patterns for custom widgets.

## AVOID
- A11Y-003.A1: Do not use positive tabindex or remove visible focus without replacement.

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
Sortable table header is a button with accessible sort state, not a clickable div.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Every action keyboard-operable?
- [ ] Order logical?
- [ ] No trap?
- [ ] Focus visible/not obscured?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C Understanding Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-006` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `CMP-005` — retrieve when the feature crosses into this topic.
