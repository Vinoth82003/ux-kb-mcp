---
id: EVAL-008
title: "UX Metrics"
domain: evaluation
group: M10
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, critique]
tags: [ux-metrics, evaluation]
applies_to: [web, mobile]
related: [EVAL-006, SAAS-003, UX-005, EVAL-007]
sources:
  - name: "NN/g UX Metrics"
    url: "https://www.nngroup.com/articles/ux-metrics/"
  - name: "Google HEART Framework"
    url: "https://research.google/pubs/pub36299/"
updated: 2026-11-15
---

# EVAL-008 — UX Metrics

## Summary
UX metrics quantify task outcomes; select measures tied to user and business goals.

## MUST
- EVAL-008.M1: Define formula, population, event, period, segmentation and data quality.

## SHOULD
- EVAL-008.S1: Combine effectiveness, efficiency and satisfaction; interpret qualitative evidence too.

## AVOID
- EVAL-008.A1: Do not use page views or time-on-page alone as proof of value.

## DECIDE
| Situation | Decision |
|---|---|
| Metric definition unclear | Pause reporting |
| Proxy metric only | Label as proxy and add guardrail |
| Qualitative conflict | Investigate before changing design |

## STATES
- Baseline
- Experiment
- Segmentation
- Guardrail review
- Post-launch

## EXAMPLE
Good: Task success = unassisted completions / participants attempting task. Bad: "Engagement up 20%" with no definition.

## FAILURE MODES
- Vanity metrics can mask task failure; pair with outcome metrics.
- Small samples create noise; state confidence and period.
- Metric gaming follows incentives; review guardrails regularly.

## CHECK
- [ ] Formula/denominator stated?
- [ ] Segments/time stated?
- [ ] Guardrails and qualitative evidence?

## SOURCE NOTES
- [NN/g UX Metrics](https://www.nngroup.com/articles/ux-metrics/) — authoritative reference; this document paraphrases relevant guidance.
- [Google HEART Framework](https://research.google/pubs/pub36299/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `EVAL-006` — retrieve when the feature crosses into this topic.
- `SAAS-003` — retrieve when the feature crosses into this topic.
- `UX-005` — retrieve when the feature crosses into this topic.
- `EVAL-007` — retrieve when the feature crosses into this topic.