---
id: SAAS-006
title: "Pricing Pages"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [research, proposal, critique, implement]
tags: [pricing-pages, saas]
applies_to: [web, mobile]
related: [SAAS-007, CW-004, EVAL-006, CW-001]
sources:
  - name: "Deceptive Patterns (Brignull)"
    url: "https://www.deceptive.design/"
  - name: "FTC Dark Patterns Report"
    url: "https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers"
updated: 2026-11-15
---

# SAAS-006 — Pricing Pages

## Summary
Pricing pages let buyers compare plans and predict total cost.

## MUST
- SAAS-006.M1: State plan limits, billing cadence and material fees.

## SHOULD
- SAAS-006.S1: Make differences decision-relevant and clarify renewal.

## AVOID
- SAAS-006.A1: Do not hide restrictions in footnotes or use fake urgency.

## DECIDE
| Situation | Decision |
|---|---|
| Plan comparison | Highlight decision-relevant diffs |
| Annual vs monthly | Show both and renewal |
| Material fee | Disclose before commitment |

## STATES
- Loading
- Compare
- Selected
- Checkout
- Error
- Empty (no plans)

## EXAMPLE
Good: Plan card shows price, cadence, seats, overage and renewal. Bad: Price with '*' footnote hiding limits.

## FAILURE MODES
- Hidden limits/fees surprise buyers; disclose all cost drivers.
- Fake urgency erodes trust; avoid.
- Unclear renewal leads chargebacks; state renewal and cancellation.

## CHECK
- [ ] Total cost drivers visible?
- [ ] Plan differences clear?
- [ ] Claims verified?

## SOURCE NOTES
- [Deceptive Patterns (Brignull)](https://www.deceptive.design/) — authoritative reference; this document paraphrases relevant guidance.
- [FTC Dark Patterns Report](https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `SAAS-007` — retrieve when the feature crosses into this topic.
- `CW-004` — retrieve when the feature crosses into this topic.
- `EVAL-006` — retrieve when the feature crosses into this topic.
- `CW-001` — retrieve when the feature crosses into this topic.