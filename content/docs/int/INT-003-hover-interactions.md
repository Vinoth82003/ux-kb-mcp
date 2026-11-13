---
id: INT-003
title: "Hover Interactions"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [hover-interactions, interaction]
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

# INT-003 — Hover Interactions

## Summary
Hover is a pointer enhancement, never the only access path.

## MUST
- INT-003.M1: Provide equivalent focus, click or touch behavior for hover-revealed actions.

## SHOULD
- INT-003.S1: Keep hover previews dismissible and available long enough to reach.

## AVOID
- INT-003.A1: Do not reveal essential controls only on hover.

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
Row menu appears on hover and focus and remains touch-accessible.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Keyboard equivalent?
- [ ] Touch equivalent?
- [ ] Content dismissible?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `EVAL-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
