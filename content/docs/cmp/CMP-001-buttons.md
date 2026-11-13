---
id: CMP-001
title: "Buttons"
domain: components
group: M03
type: pattern
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [buttons, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-005, INT-004, RSP-005]
sources:
  - name: "Apple HIG Buttons"
    url: "https://developer.apple.com/design/human-interface-guidelines/buttons"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "GOV.UK Design System Components"
    url: "https://design-system.service.gov.uk/components/"
updated: 2026-11-12
---

# CMP-001 — Buttons

## Summary
A button triggers an action; label and hierarchy must predict its consequence.

## MUST
- CMP-001.M1: Use verb + object labels such as “Save changes”; keep prominent actions to one or two per view.

## SHOULD
- CMP-001.S1: Use a lower-emphasis style for secondary actions and explicit consequence for destructive actions.

## AVOID
- CMP-001.A1: Never leave icon-only controls unnamed or use generic “OK” when the outcome can be named.

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
[Cancel] [Save changes] is clearer than [OK] [Submit].

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Outcome clear?
- [ ] Primary hierarchy singular?
- [ ] Focus/loading states designed?
- [ ] Target size checked?

## SOURCE NOTES
- [Apple HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Design System Components](https://design-system.service.gov.uk/components/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `RSP-005` — retrieve when the feature crosses into this topic.
