---
id: CMP-001
title: "Buttons"
domain: components
group: M03
type: pattern
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [buttons, components]
applies_to: [web, mobile]
related: [A11Y-002, A11Y-003, A11Y-005, EVAL-003]
sources:
  - name: "Apple HIG Buttons"
    url: "https://developer.apple.com/design/human-interface-guidelines/buttons"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "GOV.UK Design System Components"
    url: "https://design-system.service.gov.uk/components/"
updated: 2026-11-15
---

# CMP-001 — Buttons

## Summary
A button triggers an action; its label and visual hierarchy must predict its consequence and distinguish it from navigation.

## MUST
- CMP-001.M1: Use a verb + object label such as “Save changes”; keep prominent actions to one or two per view.
- CMP-001.M2: Use native `<button>` for actions and `<a>` only for navigation.
- CMP-001.M3: Give icon-only buttons an accessible name (visible text or aria-label).
- CMP-001.M4: Provide a visible focus indicator and keyboard activation via Enter/Space.

## SHOULD
- CMP-001.S1: Use a lower-emphasis style for secondary actions and require explicit consequence or confirmation for destructive actions.
- CMP-001.S2: Meet target size: at least 24×24 CSS px (WCAG 2.5.8) and aim for 44–48 px for primary controls.

## AVOID
- CMP-001.A1: Do not use generic “OK”/“Submit” when the outcome can be named; never leave icon-only controls unnamed.
- CMP-001.A2: Do not use buttons for navigation or links for actions.

## DECIDE
| Situation | Decision |
|---|---|
| Primary action | Single high-emphasis button per view |
| Secondary action | Lower-emphasis (outline/ghost) button |
| Destructive action | Explicit verb plus confirmation or undo |
| Icon-only control | Accessible name plus tooltip |

## STATES
- Default
- Hover
- Focus visible
- Active/pressed
- Disabled
- Loading
- Error
- Responsive

## EXAMPLE
Good: “[Cancel] [Save changes]” with Save as the single primary action. Bad: “[OK] [Submit]” or an icon-only trash button with no accessible name.

## FAILURE MODES
- Generic labels hide the consequence until after activation.
- Icon-only controls are unnamed for screen-reader users.
- Undersized or clustered targets cause misactivation on touch.

## CHECK
- [ ] Label names the outcome?
- [ ] Primary hierarchy singular?
- [ ] Native element used?
- [ ] Accessible name present?
- [ ] Focus visible?
- [ ] Target size checked?

## SOURCE NOTES
- [Apple HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Design System Components](https://design-system.service.gov.uk/components/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-002` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `EVAL-003` — retrieve when the feature crosses into this topic.