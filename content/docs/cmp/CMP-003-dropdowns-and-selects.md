---
id: CMP-003
title: "Dropdowns and Selects"
domain: components
group: M03
type: pattern
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [dropdowns-and-selects, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-006, EVAL-004, INT-004]
sources:
  - name: "GOV.UK Design System Components"
    url: "https://design-system.service.gov.uk/components/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-15
---

# CMP-003 — Dropdowns and Selects

## Summary
Selects suit finite option sets; they add interaction cost and hide alternatives.

## MUST
- CMP-003.M1: Use native `<select>` when option count and platform behavior fit; add typeahead/search for long lists.
- CMP-003.M2: Provide an accessible name and keyboard operability (native or APG listbox pattern).
- CMP-003.M3: Group options with optgroup/headers and sort predictable catalogues.

## SHOULD
- CMP-003.S1: Prefer radios or segmented controls for 2–5 mutually exclusive choices that benefit from scanning (heuristic, not WCAG).
- CMP-003.S2: Show loading/empty states and provide a clear option when the field is optional.

## AVOID
- CMP-003.A1: Do not hide 2–5 mutually exclusive choices in a dropdown when radios scan faster (heuristic, not a WCAG criterion).
- CMP-003.A2: Do not build a custom select without keyboard, focus and ARIA support.

## DECIDE
| Situation | Decision |
|---|---|
| 2–5 options, scan matters | Radios/segmented control |
| Many options | Native select with search |
| Custom widget needed | APG listbox pattern + keyboard model |
| Optional field | Include “None” option or clear control |

## STATES
- Default
- Open
- Focus
- Selected
- Disabled
- Loading/empty
- Error
- Responsive

## EXAMPLE
Good: Country list uses a searchable select; yes/no uses radios. Bad: 3 yes/no options hidden in a dropdown.

## FAILURE MODES
- Custom selects lose keyboard and assistive-tech support.
- Hidden options increase selection errors and time.
- Unsorted or ungrouped long lists impede scanning.

## CHECK
- [ ] Options distinct and grouped?
- [ ] Keyboard selection works?
- [ ] Loading/empty explained?
- [ ] Native or APG pattern followed?

## SOURCE NOTES
- [GOV.UK Design System Components](https://design-system.service.gov.uk/components/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `EVAL-004` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.