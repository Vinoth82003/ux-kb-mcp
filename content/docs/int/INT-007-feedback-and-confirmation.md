---
id: INT-007
title: "Feedback and Confirmation"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [feedback-and-confirmation, interaction]
applies_to: [web, mobile]
related: [EVAL-001, A11Y-003, A11Y-006, INT-006]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "GOV.UK Error Message"
    url: "https://design-system.service.gov.uk/components/error-message/"
updated: 2026-11-12
---

# INT-007 — Feedback and Confirmation

## Summary
Feedback closes the loop so users know whether an action was accepted, completed or rejected.

## MUST
- INT-007.M1: Acknowledge state-changing actions and distinguish queued, processing and completed.

## SHOULD
- INT-007.S1: Use undo for reversible low-risk actions when safer than confirmation.

## AVOID
- INT-007.A1: Do not show success before backend confirmation.

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
After archive, show status and Undo only if restoration truly works.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Feedback matches backend?
- [ ] Reversibility considered?
- [ ] Confirmation proportional?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `EVAL-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
