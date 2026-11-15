---
id: A11Y-003
title: "Keyboard Accessibility"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [keyboard-accessibility, accessibility]
applies_to: [web, mobile]
related: [INT-004, CMP-005, CMP-007]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "W3C WCAG 2.2 Quick Reference"
    url: "https://www.w3.org/WAI/WCAG22/quickref/"
  - name: "W3C Understanding Keyboard"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html"
updated: 2026-11-15
---

# A11Y-003 — Keyboard Accessibility

## Summary
All functionality must work by keyboard without traps, hidden focus or pointer-only gestures.

## MUST
- A11Y-003.M1: SC 2.1.1: all functionality available from keyboard.
- A11Y-003.M2: SC 2.1.2: no keyboard trap; provide a documented escape.
- A11Y-003.M3: SC 2.4.11: focus not obscured by sticky headers or overlays.
- A11Y-003.M4: SC 2.5.7: provide a non-drag single-pointer alternative for dragging movements.

## SHOULD
- A11Y-003.S1: Use native controls; implement arrow/Home/End/Escape patterns for custom widgets.
- A11Y-003.S2: Keep tab order aligned with visual and task order.

## AVOID
- A11Y-003.A1: Do not use positive tabindex or remove visible focus without replacement.
- A11Y-003.A2: Do not ship pointer-only interactions without a keyboard equivalent.

## DECIDE
| Situation | Decision |
|---|---|
| Native control available | Use native element |
| Custom widget needed | Implement published keyboard model and test |
| Focus moves into modal | Trap focus inside and restore on close |

## STATES
- Default
- Focus visible
- Focus obscured risk
- Modal open
- Drag in progress
- Error

## EXAMPLE
Good: "Sortable table header is a button with Enter/Space sort and aria-sort." Bad: "Clickable div with onClick only."

## FAILURE MODES
- Custom widgets lose keyboard support after visual redesign.
- Sticky headers obscure focused elements.
- Drag-only reordering blocks keyboard users.

## CHECK
- [ ] Every action keyboard-operable?
- [ ] No trap?
- [ ] Focus visible/not obscured?
- [ ] Drag has alternative?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C Understanding Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `INT-004` — retrieve when the feature crosses into this topic.
- `CMP-005` — retrieve when the feature crosses into this topic.
- `CMP-007` — retrieve when the feature crosses into this topic.
