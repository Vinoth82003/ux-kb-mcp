---
id: INT-004
title: "Focus Management"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [audit, proposal, critique, implement]
tags: [focus-management, interaction]
applies_to: [web, mobile]
related: [A11Y-003, INT-003, CMP-005, A11Y-001]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "W3C WCAG 2.2 Understanding Focus Appearance"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html"
  - name: "NN/g Keyboard Accessibility"
    url: "https://www.nngroup.com/articles/keyboard-accessibility/"
updated: 2026-11-15
---

# INT-004 — Focus Management

## Summary
Focus marks the current keyboard point; it must stay visible, logically ordered and stable through dynamic changes.

## MUST
- INT-004.M1: Keep DOM order aligned with visual and task order; avoid positive tabindex.
- INT-004.M2: Provide a visible focus indicator with at least 2 px outline (or equivalent) and ≥3:1 contrast.
- INT-004.M3: Move focus deliberately after route changes, dialog open/close and dynamic validation, and restore it on close.

## SHOULD
- INT-004.S1: Preserve focus on the nearest meaningful element when content is removed or reordered.
- INT-004.S2: Avoid focus jumps caused by layout shift or auto-scrolling.

## AVOID
- INT-004.A1: Do not remove outlines without a perceivable replacement.
- INT-004.A2: Do not trap focus except inside an open modal, and always provide an escape.

## DECIDE
| Situation | Decision |
|---|---|
| Route change | Move focus to main heading or landmark |
| Dialog open | Trap focus inside; restore trigger on close |
| Content removed | Focus next sibling or stable container |
| Dynamic validation | Focus summary or first invalid field |

## STATES
- Default
- Focus visible
- Focus obscured risk
- Modal open
- Dynamic update
- Focus restored

## EXAMPLE
Good: "After deleting a row, focus moves to the next row action; after closing a dialog, focus returns to the trigger." Bad: "Focus stays on a removed element or jumps to the page top."

## FAILURE MODES
- Invisible or obscured focus breaks keyboard navigation.
- Focus not restored after modal close disorients users.
- Layout shift can move focus off-screen or behind sticky headers.

## CHECK
- [ ] Focus visible?
- [ ] Order logical?
- [ ] Dynamic changes preserve focus?
- [ ] Not obscured by sticky/overlay?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Keyboard Accessibility](https://www.nngroup.com/articles/keyboard-accessibility/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `INT-003` — retrieve when the feature crosses into this topic.
- `CMP-005` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
