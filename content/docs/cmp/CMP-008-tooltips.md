---
id: CMP-008
title: "Tooltips"
domain: components
group: M03
type: pattern
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [tooltips, components]
applies_to: [web, mobile]
related: [INT-003, A11Y-003, A11Y-004, A11Y-005]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "W3C WCAG 2.2 Understanding Content on Hover or Focus"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html"
updated: 2026-11-15
---

# CMP-008 — Tooltips

## Summary
Tooltips add brief context; they must not carry essential instructions.

## MUST
- CMP-008.M1: Expose the tooltip on hover and keyboard focus; keep it dismissible (Esc) and available while pointer/focus remains (WCAG 1.4.13).
- CMP-008.M2: Do not obscure the trigger; position so content stays visible on hover/focus (WCAG 1.4.13).
- CMP-008.M3: Provide an accessible name for the trigger independent of the tooltip.

## SHOULD
- CMP-008.S1: Use for short clarifications only (a sentence or less).
- CMP-008.S2: Delay show slightly to avoid flicker; persist while hovered or focused.

## AVOID
- CMP-008.A1: Do not replace labels or put long help in hover-only content.
- CMP-008.A2: Do not show tooltips on touch-only targets without an alternative.

## DECIDE
| Situation | Decision |
|---|---|
| Short clarification | Tooltip on hover + focus |
| Essential info | Inline text/help, not tooltip |
| Touch device | Tap-to-reveal or inline |
| Long help | Help link/dialog |

## STATES
- Hidden
- Showing
- Visible
- Dismissed
- Hover
- Focus
- Responsive

## EXAMPLE
Good: Tooltip supplements an accessible “Export CSV” button name; dismissible with Esc. Bad: a field label exists only as a tooltip.

## FAILURE MODES
- Hover-only content is unreachable for keyboard and touch users.
- Tooltips covering triggers cause flicker and loss of access (WCAG 1.4.13).
- Essential instructions hidden in tooltips cause task failure.

## CHECK
- [ ] Focus equivalent?
- [ ] Dismissible?
- [ ] Hoverable/persistent?
- [ ] Essential info elsewhere?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `INT-003` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-004` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.