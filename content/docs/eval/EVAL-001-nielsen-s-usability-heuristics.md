---
id: EVAL-001
title: "Nielsen's Usability Heuristics"
domain: evaluation
group: M10
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, critique]
tags: [nielsen-s-usability-heuristics, evaluation]
applies_to: [web, mobile]
related: [UX-005, A11Y-001, INT-001, CW-003]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "NN/g How to Conduct a Heuristic Evaluation"
    url: "https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/"
updated: 2026-11-15
---

# EVAL-001 — Nielsen's Usability Heuristics

## Summary
Use Nielsen's ten heuristics as an inspection framework; every finding names the violated heuristic and user consequence.

## MUST
- EVAL-001.M1: Inspect all ten heuristics: visibility of system status; match between system and real world; user control and freedom; consistency and standards; error prevention; recognition rather than recall; flexibility and efficiency of use; aesthetic and minimalist design; help users recognize, diagnose, and recover from errors; help and documentation.

## SHOULD
- EVAL-001.S1: Record screen/step, evidence, user/task impact, severity and recommendation.

## AVOID
- EVAL-001.A1: Do not mark failure merely because a preferred pattern is absent.

## DECIDE
| Situation | Decision |
|---|---|
| Heuristic violated on critical task | Block or fix before release |
| Heuristic risk unverified | Validate with task test |
| Cosmetic inconsistency | Record proportionately |

## STATES
- Task start
- Primary task
- Error/recovery
- Completion
- Repeat use

## EXAMPLE
Good: "No save confirmation" cites visibility of system status and notes lost trust. Bad: "I dislike the blue" with no heuristic or consequence.

## FAILURE MODES
- Teams often conflate "consistency" with visual sameness; record the specific user confusion.
- Missing help documentation may be acceptable for expert tools; validate with task tests.
- Heuristic findings without severity or evidence become opinion; require both.

## CHECK
- [ ] All 10 considered?
- [ ] Findings evidence-backed?
- [ ] Severity justified?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g How to Conduct a Heuristic Evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-005` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `INT-001` — retrieve when the feature crosses into this topic.
- `CW-003` — retrieve when the feature crosses into this topic.