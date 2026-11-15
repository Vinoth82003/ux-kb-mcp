---
id: A11Y-006
title: "ARIA"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [aria, accessibility]
applies_to: [web, mobile]
related: [A11Y-003, A11Y-004, CMP-005, CMP-007]
sources:
  - name: "W3C WAI-ARIA 1.2"
    url: "https://www.w3.org/TR/wai-aria-1.2/"
  - name: "W3C ARIA Authoring Practices Guide"
    url: "https://www.w3.org/WAI/ARIA/apg/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-15
---

# A11Y-006 — ARIA

## Summary
ARIA fills semantic gaps when native HTML cannot express a custom widget; incorrect ARIA harms access.

## MUST
- A11Y-006.M1: Prefer native HTML and keep role, name and state synchronized with visible behavior.
- A11Y-006.M2: Use ARIA only to add missing semantics, not to override native elements.
- A11Y-006.M3: SC 4.1.2: update states (expanded, selected, checked, disabled) with the UI.

## SHOULD
- A11Y-006.S1: Follow the APG keyboard pattern for every custom widget.
- A11Y-006.S2: Test name, role and state with assistive technology.

## AVOID
- A11Y-006.A1: Do not conflict with native semantics or override visible labels without reason.
- A11Y-006.A2: Do not add redundant ARIA to native elements.

## DECIDE
| Situation | Decision |
|---|---|
| Native element fits | Do not use ARIA |
| Custom widget | Use APG pattern and keyboard model |
| State changes | Update ARIA and visible UI together |

## STATES
- Collapsed
- Expanded
- Selected
- Checked
- Disabled
- Invalid

## EXAMPLE
Good: "Disclosure button updates aria-expanded and controls its panel." Bad: "aria-hidden on visible focusable content."

## FAILURE MODES
- ARIA drift: state not updated with UI.
- Overriding native semantics breaks AT expectations.
- Using role without keyboard support.

## CHECK
- [ ] Native HTML considered?
- [ ] Role/name/state correct?
- [ ] Keyboard model complete?
- [ ] APG followed?

## SOURCE NOTES
- [W3C WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-004` — retrieve when the feature crosses into this topic.
- `CMP-005` — retrieve when the feature crosses into this topic.
- `CMP-007` — retrieve when the feature crosses into this topic.
