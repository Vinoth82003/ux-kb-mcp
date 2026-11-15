---
id: EVAL-006
title: "Conversion Evaluation"
domain: evaluation
group: M10
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, critique]
tags: [conversion-evaluation, evaluation]
applies_to: [web, mobile]
related: [SAAS-006, SAAS-004, CW-002, EVAL-008]
sources:
  - name: "Deceptive Patterns (Brignull)"
    url: "https://www.deceptive.design/"
  - name: "FTC Dark Patterns Report"
    url: "https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers"
updated: 2026-11-15
---

# EVAL-006 — Conversion Evaluation

## Summary
Conversion evaluation tests whether qualified users complete meaningful actions without dark patterns.

## MUST
- EVAL-006.M1: Define eligible population, conversion event, denominator, window and guardrails before analysis.

## SHOULD
- EVAL-006.S1: Pair conversion with errors, refunds, cancellations or support burden.

## AVOID
- EVAL-006.A1: Do not fabricate urgency, preselect add-ons or hide material terms.

## DECIDE
| Situation | Decision |
|---|---|
| Metric rises but guardrail falls | Investigate before celebrating |
| Experiment risk | Stop on harm threshold |
| Deceptive pattern temptation | Reject; redesign value proposition |

## STATES
- Landing
- Checkout
- Confirmation
- Post-purchase
- Cancellation/refund

## EXAMPLE
Good: Valid subscriptions / eligible checkout starts plus refund rate. Bad: Counting all page views as conversions.

## FAILURE MODES
- Conversion lifts can come from coercion; audit copy and defaults.
- Guardrails lag; define stop rules before launch.
- Dark patterns may pass short-term metrics but increase refunds/support; track downstream.

## CHECK
- [ ] Event/denominator defined?
- [ ] Guardrails included?
- [ ] No deceptive pattern?

## SOURCE NOTES
- [Deceptive Patterns (Brignull)](https://www.deceptive.design/) — authoritative reference; this document paraphrases relevant guidance.
- [FTC Dark Patterns Report](https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `SAAS-006` — retrieve when the feature crosses into this topic.
- `SAAS-004` — retrieve when the feature crosses into this topic.
- `CW-002` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.