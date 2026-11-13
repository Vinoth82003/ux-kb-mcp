---
id: EVAL-003
title: "Fitts's Law"
domain: evaluation
group: M10
type: principle
status: reviewed
rev: 1
priority: core
stages: [audit, critique]
tags: [fitts-s-law, evaluation]
applies_to: [web, mobile]
related: [UX-005, A11Y-001, VIS-001, INT-001]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "NN/g Cognitive Load"
    url: "https://www.nngroup.com/articles/minimize-cognitive-load/"
  - name: "NN/g Fitts's Law"
    url: "https://www.nngroup.com/articles/fitts-law/"
  - name: "NN/g Hick's Law"
    url: "https://www.nngroup.com/articles/hick-law/"
  - name: "NN/g UX Metrics"
    url: "https://www.nngroup.com/articles/ux-metrics/"
updated: 2026-11-12
---

# EVAL-003 — Fitts's Law

## Summary
Fitts predicts target acquisition time increases with distance and decreases as target size increases; it is a heuristic, not a WCAG criterion.

## MUST
- EVAL-003.M1: Make frequent/critical controls easy to acquire and near task context.

## SHOULD
- EVAL-003.S1: Separate adjacent targets and consider pointer/touch precision.

## AVOID
- EVAL-003.A1: Do not use Fitts to excuse WCAG target-size failure.

## DECIDE
| Situation | Decision |
|---|---|
| Observed failure | Record evidence and severity |
| Potential risk | Validate with task test |
| Metric movement | Inspect definition and guardrails |

## STATES
- Task start
- Primary task
- Error/recovery
- Completion
- Repeat use

## EXAMPLE
Place Save near edited form with comfortable hit area.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Critical targets easy?
- [ ] Adjacent targets separated?
- [ ] WCAG checked independently?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Cognitive Load](https://www.nngroup.com/articles/minimize-cognitive-load/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Fitts's Law](https://www.nngroup.com/articles/fitts-law/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Hick's Law](https://www.nngroup.com/articles/hick-law/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g UX Metrics](https://www.nngroup.com/articles/ux-metrics/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-005` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `VIS-001` — retrieve when the feature crosses into this topic.
- `INT-001` — retrieve when the feature crosses into this topic.
