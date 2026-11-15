---
id: A11Y-005
title: "Semantic HTML"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [semantic-html, accessibility]
applies_to: [web, mobile]
related: [A11Y-006, CMP-001, CMP-002, INT-004]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "MDN HTML elements reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element"
  - name: "HTML Living Standard"
    url: "https://html.spec.whatwg.org/"
updated: 2026-11-15
---

# A11Y-005 — Semantic HTML

## Summary
Semantic HTML supplies reliable browser and assistive technology behavior with less custom code.

## MUST
- A11Y-005.M1: Use native button, anchor, input, select, form, heading, list and table for their actual purpose.
- A11Y-005.M2: SC 1.3.1: info and relationships programmatically determinable.
- A11Y-005.M3: Preserve native keyboard and focus behavior when styling.

## SHOULD
- A11Y-005.S1: Keep heading hierarchy logical and use landmarks for page regions.
- A11Y-005.S2: Use semantic elements before ARIA.

## AVOID
- A11Y-005.A1: Do not use clickable divs as substitutes for native controls.
- A11Y-005.A2: Do not choose heading levels for visual size.

## DECIDE
| Situation | Decision |
|---|---|
| Element matches behavior | Use native semantic |
| No native equivalent | Use div with ARIA pattern |
| Need link vs button | Link navigates, button acts |

## STATES
- Default
- Hover/focus
- Disabled
- Expanded/collapsed
- Error
- Responsive

## EXAMPLE
Good: "View invoice is <a>, Download invoice is <button>." Bad: "<div onclick> for both."

## FAILURE MODES
- Div-based controls lose keyboard and AT semantics.
- Skipped heading levels confuse navigation.
- Styling removes native focus.

## CHECK
- [ ] Element matches behavior?
- [ ] Heading hierarchy logical?
- [ ] Native behavior preserved?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) — authoritative reference; this document paraphrases relevant guidance.
- [HTML Living Standard](https://html.spec.whatwg.org/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `CMP-001` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
