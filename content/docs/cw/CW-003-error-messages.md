---
id: CW-003
title: "Error Messages"
domain: content_writing
group: M07
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [error-messages, content-writing]
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

# CW-003 — Error Messages

## Summary
Error copy states what happened, impact and the next feasible action.

## MUST
- CW-003.M1: Use plain language and name the specific correction.

## SHOULD
- CW-003.S1: Preserve user data and associate the message with the field.

## AVOID
- CW-003.A1: Avoid raw codes, vague messages without next steps and blame.

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
Enter a date after 1 January 2025, not Invalid date.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Problem specific?
- [ ] Recovery feasible?
- [ ] Input intact?
- [ ] Programmatically associated?

## SOURCE NOTES
- [NN/g Writing for the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-007` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
