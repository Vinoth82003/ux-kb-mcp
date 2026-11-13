---
id: CMP-005
title: "Modals and Dialogs"
domain: components
group: M03
type: pattern
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [modals-and-dialogs, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-005, INT-004, RSP-005]
sources:
  - name: "GOV.UK Design System Components"
    url: "https://design-system.service.gov.uk/components/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-12
---

# CMP-005 — Modals and Dialogs

## Summary
Dialogs interrupt context and should be reserved for focused decisions or contained tasks.

## MUST
- CMP-005.M1: Move focus into dialog, manage tab order, restore focus on close and provide a descriptive title.

## SHOULD
- CMP-005.S1: Support Escape when safe and name the object/consequence for destructive actions.

## AVOID
- CMP-005.A1: Do not use dialogs for long workflows or nested dialog stacks.

## DECIDE
| Situation | Decision |
|---|---|
| Simple task | Use least complex semantic control |
| Custom behavior | Document keyboard/focus model |
| Mobile constraint | Preserve target size and labels |

## STATES
- Default
- Hover
- Focus
- Selected/active
- Disabled
- Loading
- Error
- Responsive

## EXAMPLE
“Delete Q4 forecast?” with Cancel and Delete.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Purpose named?
- [ ] Focus managed/restored?
- [ ] Escape behavior safe?
- [ ] Background inert?

## SOURCE NOTES
- [GOV.UK Design System Components](https://design-system.service.gov.uk/components/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `RSP-005` — retrieve when the feature crosses into this topic.
