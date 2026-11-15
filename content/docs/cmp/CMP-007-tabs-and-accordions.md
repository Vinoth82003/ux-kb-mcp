---
id: CMP-007
title: "Tabs and Accordions"
domain: components
group: M03
type: pattern
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [tabs-and-accordions, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-006, EVAL-004, INT-004]
sources:
  - name: "GOV.UK Design System Components"
    url: "https://design-system.service.gov.uk/components/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "W3C ARIA Authoring Practices Guide"
    url: "https://www.w3.org/WAI/ARIA/apg/"
updated: 2026-11-15
---

# CMP-007 — Tabs and Accordions

## Summary
Tabs switch between peer views; accordions reveal optional content within a page.

## MUST
- CMP-007.M1: Use tabs for peer sections sharing context; accordions for secondary optional details.
- CMP-007.M2: Implement the APG keyboard model: Tab to the tablist, Arrow keys between tabs, Enter/Space to activate, Home/End.
- CMP-007.M3: Expose state with role="tab", aria-selected, aria-controls and role="tabpanel" with aria-labelledby; accordions use aria-expanded/aria-controls.

## SHOULD
- CMP-007.S1: Keep tab labels short and parallel; avoid tabs for primary site navigation.
- CMP-007.S2: Preserve scroll position and focus when switching tabs where appropriate.

## AVOID
- CMP-007.A1: Do not use tabs as primary site navigation or hide essential instructions in collapsed panels.
- CMP-007.A2: Do not implement tabs without keyboard support or with positive tabindex.

## DECIDE
| Situation | Decision |
|---|---|
| Peer views, same context | Tabs with APG keyboard model |
| Secondary details | Accordion with aria-expanded |
| Many tabs | Consider navigation or segmented control |
| Deep linking needed | Sync tab to URL hash |

## STATES
- Default
- Hover
- Focus
- Selected/active
- Expanded/collapsed
- Disabled
- Loading
- Responsive

## EXAMPLE
Good: Profile/Security/Notifications tabs with arrow-key navigation; FAQ in an accordion. Bad: tabs used as site nav; collapsed panel hiding required instructions.

## FAILURE MODES
- Missing keyboard support blocks tab navigation.
- Hidden essential content in accordions causes task failure.
- State not exposed to assistive tech (aria-selected/expanded).

## CHECK
- [ ] Peer relationship clear?
- [ ] Keyboard pattern implemented (APG)?
- [ ] State exposed to AT?
- [ ] Essential content visible?

## SOURCE NOTES
- [GOV.UK Design System Components](https://design-system.service.gov.uk/components/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `EVAL-004` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.