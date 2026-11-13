---
id: CW-002
title: "Microcopy"
domain: content_writing
group: M07
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [microcopy, content-writing]
applies_to: [web, mobile]
related: [A11Y-007, A11Y-005, INT-006, CMP-002]
sources:
  - name: "NN/g Writing for the Web"
    url: "https://www.nngroup.com/articles/how-users-read-on-the-web/"
  - name: "NN/g Form Design"
    url: "https://www.nngroup.com/articles/web-form-design/"
  - name: "GOV.UK Error Message"
    url: "https://design-system.service.gov.uk/components/error-message/"
updated: 2026-11-12
---

# CW-002 — Microcopy

## Summary
Microcopy is text attached to a control or decision; it should reduce uncertainty at the point of action.

## MUST
- CW-002.M1: Place helper text near the control; distinguish label, hint and placeholder.

## SHOULD
- CW-002.S1: State constraints before users commit.

## AVOID
- CW-002.A1: Do not use placeholder as the only label/instruction.

## DECIDE
| Situation | Decision |
|---|---|
| Before action | Explain requirement/consequence |
| During entry | Keep guidance adjacent |
| After error | Explain fix and preserve work |

## STATES
- Default
- Required/optional
- Validation
- Success
- Empty
- Localized

## EXAMPLE
Label Work email; hint explains which address to use.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Label and hint distinct?
- [ ] Constraint before failure?
- [ ] No placeholder-only label?

## SOURCE NOTES
- [NN/g Writing for the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-007` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
