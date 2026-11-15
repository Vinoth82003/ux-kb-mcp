---
id: EVAL-009
title: "Independent Critic Rubric"
domain: evaluation
group: M08
type: principle
status: reviewed
rev: 1
priority: core
stages: [critique]
tags: [critique, rubric, evaluation]
applies_to: [web, mobile]
related: [EVAL-007, EVAL-008, UX-005]
sources:
  - name: "UX-KB Core Agent Rules"
    url: "https://github.com/Vinoth82003/ux-kb-mcp/blob/main/content/core.md"
updated: 2026-11-15
---

# EVAL-009 — Independent Critic Rubric

## Summary
100-point rubric used by the independent critique step. Pass requires >=85 with zero critical defects and no more than three revisions.

## MUST
- EVAL-009.M1: Score every proposal against all eight criteria below; do not skip a criterion.
- EVAL-009.M2: Deduct points only with evidence; every deduction states the user consequence.
- EVAL-009.M3: A critical defect (task blocker, data-loss risk, deceptive action/pricing, severe privacy/security or critical accessibility barrier) blocks regardless of score.

## SHOULD
- EVAL-009.S1: Separate facts, assumptions and hypotheses in the evidence column.

## AVOID
- EVAL-009.A1: Do not treat a fetched doc ID as proof that a source semantically supports a claim.

## DECIDE
| Situation | Decision |
|---|---|
| Score >=85 and zero critical defects | Ready for approval |
| Score <85 or any critical defect | Revise (max three revisions) |
| More than three revisions | Stop and escalate |

## STATES
- Draft
- Critiqued
- Revised
- Ready for approval

## RUBRIC
| Criterion | Points | Full-credit evidence |
|---|---:|---|
| User need and problem fit | 15 | User, task, evidence, constraints and verdict explicit |
| Usability and heuristics | 20 | Clear hierarchy, feedback, control, prevention/recovery, consistency |
| Accessibility | 15 | Applicable WCAG 2.2 A/AA; keyboard, focus, names/roles/states, contrast, reflow |
| Visual distinctiveness / anti-slop | 15 | Product-specific direction; purposeful type/color/layout; no unsupported defaults |
| Design-system consistency | 10 | Correct tokens/components; exceptions justified |
| Completeness/states/edge cases | 10 | Relevant default/loading/empty/error/disabled/success/permission/responsive states |
| Feasibility/implementation clarity | 10 | Components, behavior, data, constraints and tests clear |
| Research evidence quality | 5 | Claims sourced; methods fit; facts/assumptions separated |

Pass >=85 and zero critical defects; max three revisions. Passing is not user approval.

## FAILURE MODES
- A high score can hide a critical defect; check critical defects before score.
- Evidence quality is the weakest criterion to fake; verify sources.
- Three revisions exhausted means the proposal needs re-scoping, not more polish.

## CHECK
- [ ] All eight criteria scored?
- [ ] Every deduction has evidence and user consequence?
- [ ] Critical defects checked?
- [ ] Revision count <=3?

## SOURCE NOTES
- [UX-KB Core Agent Rules](content/core.md) — defines the critique step and approval gate.

## RELATED DOCUMENTS
- `EVAL-007` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.
- `UX-005` — retrieve when the feature crosses into this topic.
