---
id: CMP-006
title: "Navigation Bars"
domain: components
group: M03
type: pattern
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [navigation-bars, components]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-005, RSP-006, EVAL-004]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "W3C WCAG 2.2 Understanding Bypass Blocks"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html"
updated: 2026-11-15
---

# CMP-006 — Navigation Bars

## Summary
Navigation expresses information architecture and current location.

## MUST
- CMP-006.M1: Use user vocabulary and group destinations by task.
- CMP-006.M2: Use a `<nav>` landmark with an accessible name and provide a skip link to main content (SC 2.4.1).
- CMP-006.M3: Indicate current location with `aria-current="page"` (or equivalent) in addition to color.

## SHOULD
- CMP-006.S1: Indicate current location beyond color alone (weight, underline or icon).
- CMP-006.S2: Keep primary nav concise; move secondary destinations to menus or footer.

## AVOID
- CMP-006.A1: Do not overload primary navigation or use ambiguous labels.
- CMP-006.A2: Do not rely on color alone for current location.

## DECIDE
| Situation | Decision |
|---|---|
| Top-level destinations | Primary nav landmark |
| Current page | aria-current + visual marker |
| Skip to content | Skip link before nav |
| Mobile | Collapsible menu with focus management |

## STATES
- Default
- Hover
- Focus
- Current
- Collapsed (mobile)
- Sticky
- Error
- Responsive

## EXAMPLE
Good: `<nav aria-label="Primary">` with “Overview, Transactions, Reports, Settings”; current item has `aria-current="page"` and an underline. Bad: all report links in the top nav with color-only current state.

## FAILURE MODES
- Missing landmark/skip link forces keyboard users through repeated nav.
- Color-only current location is invisible to some users.
- Overloaded nav increases decision time (Hick).

## CHECK
- [ ] Labels recognizable?
- [ ] Landmark + skip link present?
- [ ] aria-current used?
- [ ] Current location perceivable?
- [ ] Keyboard/mobile usable?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `RSP-006` — retrieve when the feature crosses into this topic.
- `EVAL-004` — retrieve when the feature crosses into this topic.