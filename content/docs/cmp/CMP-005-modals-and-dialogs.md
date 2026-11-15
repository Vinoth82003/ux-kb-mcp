---
id: CMP-005
title: "Modals and Dialogs"
domain: components
group: M03
type: pattern
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [modals-and-dialogs, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-006, INT-004, INT-006]
sources:
  - name: "GOV.UK Design System Components"
    url: "https://design-system.service.gov.uk/components/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "MDN dialog element"
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog"
updated: 2026-11-15
---

# CMP-005 — Modals and Dialogs

## Summary
Dialogs interrupt context and should be reserved for focused decisions or contained tasks.

## MUST
- CMP-005.M1: Move focus into the dialog, manage tab order, restore focus on close and provide a descriptive title.
- CMP-005.M2: Prefer native `<dialog>` with `showModal()` for modal dialogs; use `role="dialog"`/`aria-modal` and `aria-labelledby` when custom.
- CMP-005.M3: Make the background inert (inert/aria-hidden) and prevent interaction behind the dialog.

## SHOULD
- CMP-005.S1: Support Escape when safe and name the object/consequence for destructive actions.
- CMP-005.S2: Keep dialogs short; use a page or drawer for long workflows.

## AVOID
- CMP-005.A1: Do not use dialogs for long workflows or nested dialog stacks.
- CMP-005.A2: Do not leave focus in the background or allow background scroll.

## DECIDE
| Situation | Decision |
|---|---|
| Focused decision | Modal dialog with title + actions |
| Long task | Page or drawer, not dialog |
| Destructive action | Name object/consequence + confirm |
| Non-modal info | Popover/inline, not dialog |

## STATES
- Closed
- Opening
- Open
- Focus trapped
- Closing
- Error
- Responsive

## EXAMPLE
Good: “Delete Q4 forecast?” dialog with Cancel and Delete; focus on Cancel. Bad: nested dialogs or a five-step form in a modal.

## FAILURE MODES
- Focus not restored disorients keyboard users.
- Background interaction causes data loss or confusion.
- Modal overuse interrupts flow for minor tasks.

## CHECK
- [ ] Purpose named?
- [ ] Focus managed/restored?
- [ ] Escape behavior safe?
- [ ] Background inert?
- [ ] Native dialog used where possible?

## SOURCE NOTES
- [GOV.UK Design System Components](https://design-system.service.gov.uk/components/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [MDN dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.