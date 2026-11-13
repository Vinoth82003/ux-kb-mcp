---
id: INT-006
title: "Error States"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [error-states, interaction]
applies_to: [web, mobile]
related: [EVAL-001, A11Y-003, A11Y-006, INT-007]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "GOV.UK Error Message"
    url: "https://design-system.service.gov.uk/components/error-message/"
updated: 2026-11-12
---

# INT-006 — Error States

## Summary
Errors should identify the problem, preserve work and provide a feasible recovery action.

## MUST
- INT-006.M1: Explain failure in user language and give a next step.

## SHOULD
- INT-006.S1: Preserve valid values; focus summary or first invalid field after failed submit.

## AVOID
- INT-006.A1: Do not expose stack traces, internal codes or blame the user.

## DECIDE
| Situation | Decision |
|---|---|
| Immediate/reversible | Update and offer undo if useful |
| Asynchronous | Show honest progress |
| Irreversible | Explain before commit |

## STATES
- Idle
- Triggered
- Pending
- Success
- Failure
- Cancelled

## EXAMPLE
“We couldn’t save. Your edits are still here. Try again.”

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Cause specific?
- [ ] Recovery feasible?
- [ ] Input retained?
- [ ] Error announced?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `EVAL-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `INT-007` — retrieve when the feature crosses into this topic.
