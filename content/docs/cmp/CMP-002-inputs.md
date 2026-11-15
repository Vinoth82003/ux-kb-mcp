---
id: CMP-002
title: "Inputs"
domain: components
group: M03
type: pattern
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [inputs, components]
applies_to: [web, mobile]
related: [A11Y-004, A11Y-005, CW-002, CW-005]
sources:
  - name: "NN/g Form Design"
    url: "https://www.nngroup.com/articles/web-form-design/"
  - name: "GOV.UK Design System Components"
    url: "https://design-system.service.gov.uk/components/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-15
---

# CMP-002 — Inputs

## Summary
Inputs collect structured data; labels, constraints and feedback determine completion quality.

## MUST
- CMP-002.M1: Associate a persistent visible label with every field; placeholders are examples, not labels.
- CMP-002.M2: Use native input/select/textarea with appropriate type and autocomplete; preserve paste and autofill.
- CMP-002.M3: Identify input errors in text and associate them with the field (aria-describedby/aria-invalid).

## SHOULD
- CMP-002.S1: Show format constraints and required/optional status before submission; preserve valid data after errors.
- CMP-002.S2: Provide an accessible name, hint and (where needed) visible helper text adjacent to the field.

## AVOID
- CMP-002.A1: Do not block paste or use placeholder-only labels.
- CMP-002.A2: Do not clear valid input on validation failure.

## DECIDE
| Situation | Decision |
|---|---|
| Single-line value | Native input with type and label |
| Constrained format | Hint + example + validation |
| Optional field | Mark optional or omit required marker consistently |
| Error | Inline message + preserve value + focus field |

## STATES
- Default
- Focus
- Filled
- Invalid
- Disabled
- Read-only
- Loading
- Responsive

## EXAMPLE
Good: “Work email” label + hint “We send receipts here” + placeholder “name@company.com”; invalid value retained with a message. Bad: placeholder-only label “Enter email” that clears on error.

## FAILURE MODES
- Placeholder-only labels disappear on input and fail screen readers.
- Clearing valid values forces rework and abandonment.
- Unannounced or color-only errors are missed by assistive-tech users.

## CHECK
- [ ] Visible persistent label?
- [ ] Required/optional clear?
- [ ] Paste/autofill works?
- [ ] Errors preserve data and are announced?
- [ ] Format constraints shown before submit?

## SOURCE NOTES
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Design System Components](https://design-system.service.gov.uk/components/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-004` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `CW-002` — retrieve when the feature crosses into this topic.
- `CW-005` — retrieve when the feature crosses into this topic.