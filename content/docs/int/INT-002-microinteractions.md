---
id: INT-002
title: "Microinteractions"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [microinteractions, interaction]
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

# INT-002 — Microinteractions

## Summary
Microinteractions provide feedback around a single trigger, rule, response and loop.

## MUST
- INT-002.M1: Animate only when motion clarifies cause, state or spatial continuity.

## SHOULD
- INT-002.S1: Respect reduced-motion preferences and avoid delaying task completion.

## AVOID
- INT-002.A1: Do not animate every hover, loading event or number by default.

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
Bookmark state changes briefly and announces Saved.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Motion communicates?
- [ ] Reduced motion respected?
- [ ] Non-motion feedback exists?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `EVAL-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
