---
id: EVAL-007
title: "UX Audit"
domain: evaluation
group: M10
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, critique]
tags: [ux-audit, evaluation]
applies_to: [web, mobile]
related: [EVAL-001, EVAL-008, A11Y-001, UX-005]
sources:
  - name: "NN/g How to Conduct a Heuristic Evaluation"
    url: "https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-15
---

# EVAL-007 — UX Audit

## Summary
A UX audit combines heuristic inspection, accessibility, analytics and user evidence to prioritize risks.

## MUST
- EVAL-007.M1: Audit critical journeys end-to-end including empty, error, permission, loading and responsive states.

## SHOULD
- EVAL-007.S1: Separate observed defect, inferred risk and untested hypothesis.

## AVOID
- EVAL-007.A1: Do not issue generic scores without scope, evidence and severity.

## DECIDE
| Situation | Decision |
|---|---|
| Observed blocker | Block release |
| Inferred risk | Add task test |
| Untested hypothesis | Label as assumption |

## STATES
- Scope definition
- Heuristic inspection
- Accessibility check
- Analytics review
- Prioritization

## EXAMPLE
Good: Audit sign-up through first value, not only the form. Bad: Score homepage 8/10 with no scope or evidence.

## FAILURE MODES
- Audits that skip error/permission states miss critical failures; include them.
- Severity inflation reduces trust; calibrate with impact and reach.
- Mixing observation with inference hides uncertainty; label each.

## CHECK
- [ ] Scope/journeys explicit?
- [ ] Evidence types distinct?
- [ ] Priority includes impact/reach?

## SOURCE NOTES
- [NN/g How to Conduct a Heuristic Evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `EVAL-001` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `UX-005` — retrieve when the feature crosses into this topic.