---
id: CW-002
title: "Microcopy"
domain: content_writing
group: M07
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [microcopy, content-writing]
applies_to: [web, mobile]
related: [CW-001, CW-005, CMP-002, A11Y-007]
sources:
  - name: "NN/g Microcopy"
    url: "https://www.nngroup.com/articles/microcopy/"
  - name: "NN/g Form Design"
    url: "https://www.nngroup.com/articles/web-form-design/"
  - name: "GOV.UK Text Input"
    url: "https://design-system.service.gov.uk/components/text-input/"
updated: 2026-11-15
---

# CW-002 — Microcopy

## Summary
Microcopy is text attached to a control or decision; it should reduce uncertainty at the point of action.

## MUST
- CW-002.M1: Place helper text adjacent to the control; distinguish label, hint and placeholder.
- CW-002.M2: Link to CMP-002 for input, label and placeholder ownership; do not redefine those rules here.

## SHOULD
- CW-002.S1: State constraints, format and consequences before the user commits.
- CW-002.S2: Keep helper text under ~12 words; move detail into help or docs.

## AVOID
- CW-002.A1: Do not use a placeholder as the only label or instruction.
- CW-002.A2: Do not restate the label verbatim in the hint; add new information.

## DECIDE
| Situation | Decision |
|---|---|
| Label vs hint | Label names the field; hint adds rule or example |
| Constraint timing | Show before entry, not only after failure |
| Optional field | Mark "(optional)" rather than relying on asterisk convention |
| Long help | Link to docs; keep control text short |

## STATES
- Default
- Focused
- Invalid
- Disabled
- Empty
- Localized

## EXAMPLE
Good: Label "Work email"; hint "Use your company address, not a personal one." Bad: Placeholder "Enter email" with no label.

## FAILURE MODES
- Placeholder-only labels disappear once the user starts typing.
- Hints that restate labels waste space and add no value.
- Constraints discovered only after a failed submit.
- Long helper text wraps and obscures the input.

## CHECK
- [ ] Label and hint distinct?
- [ ] Constraint before failure?
- [ ] No placeholder-only label?
- [ ] Hint adds new information?

## SOURCE NOTES
- [NN/g Microcopy](https://www.nngroup.com/articles/microcopy/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Text Input](https://design-system.service.gov.uk/components/text-input/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `CW-001` — retrieve when the feature crosses into this topic.
- `CW-005` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `A11Y-007` — retrieve when the feature crosses into this topic.