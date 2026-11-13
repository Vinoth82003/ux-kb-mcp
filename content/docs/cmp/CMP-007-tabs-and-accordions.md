---
id: CMP-007
title: "Tabs and Accordions"
domain: components
group: M03
type: pattern
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [tabs-and-accordions, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-005, INT-004, RSP-005]
sources:
  - name: "GOV.UK Design System Components"
    url: "https://design-system.service.gov.uk/components/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-12
---

# CMP-007 — Tabs and Accordions

## Summary
Tabs switch between peer views; accordions reveal optional content within a page.

## MUST
- CMP-007.M1: Use tabs for peer sections sharing context; accordions for secondary optional details.

## SHOULD
- CMP-007.S1: Implement expected keyboard navigation for tabs.

## AVOID
- CMP-007.A1: Do not use tabs as primary site navigation or hide essential instructions in collapsed panels.

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
Profile/Security/Notifications tabs; secondary FAQ in accordion.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Peer relationship clear?
- [ ] Keyboard pattern implemented?
- [ ] Essential content visible?

## SOURCE NOTES
- [GOV.UK Design System Components](https://design-system.service.gov.uk/components/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `RSP-005` — retrieve when the feature crosses into this topic.
