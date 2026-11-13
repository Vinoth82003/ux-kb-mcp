---
id: CMP-003
title: "Dropdowns and Selects"
domain: components
group: M03
type: pattern
status: reviewed
rev: 1
priority: core
stages: [proposal, critique, implement]
tags: [dropdowns-and-selects, components]
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

# CMP-003 — Dropdowns and Selects

## Summary
Selects suit finite option sets; they add interaction cost and hide alternatives.

## MUST
- CMP-003.M1: Use native select when option count and platform behavior fit; add typeahead for long lists.

## SHOULD
- CMP-003.S1: Group options meaningfully and sort predictable catalogues.

## AVOID
- CMP-003.A1: Do not hide 2–5 mutually exclusive choices in a dropdown when radios scan faster.

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
Country list uses search; yes/no uses radios.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Options distinct?
- [ ] Keyboard selection works?
- [ ] Loading/empty options explained?

## SOURCE NOTES
- [GOV.UK Design System Components](https://design-system.service.gov.uk/components/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `RSP-005` — retrieve when the feature crosses into this topic.
