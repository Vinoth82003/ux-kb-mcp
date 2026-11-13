---
id: UX-005
title: "Usability Principles"
domain: ux
group: M01
type: principle
status: reviewed
rev: 1
priority: core
stages: [audit, proposal, critique]
tags: [usability-principles, ux]
applies_to: [web, mobile]
related: [EVAL-001, EVAL-002, EVAL-003, EVAL-004]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-12
---

# UX-005 — Usability Principles

## Summary
Usability is task effectiveness, efficiency and satisfaction in context; heuristics diagnose risk but do not replace user testing.

## MUST
- UX-005.M1: Define task success and critical errors before evaluation.
- UX-005.M2: Assess learnability, efficiency, error prevention, recovery and accessibility separately.
- UX-005.M3: Report severity with impact, evidence and recovery cost.

## SHOULD
- UX-005.S1: Use Nielsen heuristics as an inspection lens, not a conformance checklist.

## AVOID
- UX-005.A1: Declare a design usable because it uses a component library.
- UX-005.A2: Average away a blocker on a critical task.

## DECIDE
| Situation | Decision |
|---|---|
| Critical task blocked | Block release |
| Avoidable friction | Prioritize by reach and severity |
| Cosmetic issue | Record proportionately |

## STATES
- Learn
- Perform
- Error
- Recover
- Repeat

## EXAMPLE
A payment blocker is critical even if rare; a slightly inconsistent divider is not equivalent.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Success criteria explicit?
- [ ] Critical failures retained?
- [ ] User testing planned for uncertainty?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `EVAL-001` — retrieve when the feature crosses into this topic.
- `EVAL-002` — retrieve when the feature crosses into this topic.
- `EVAL-003` — retrieve when the feature crosses into this topic.
- `EVAL-004` — retrieve when the feature crosses into this topic.
