---
id: SAAS-007
title: "Subscription Management"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [research, proposal, critique, implement]
tags: [subscription-management, saas]
applies_to: [web, mobile]
related: [SAAS-006, CW-004, EVAL-006, INT-007]
sources:
  - name: "FTC Click-to-Cancel Rule"
    url: "https://www.ftc.gov/news-events/news/press-releases/2024/10/federal-trade-commission-announces-final-click-cancel-rule-making-it-easier-consumers-end-recurring"
  - name: "Deceptive Patterns (Brignull)"
    url: "https://www.deceptive.design/"
updated: 2026-11-15
---

# SAAS-007 — Subscription Management

## Summary
Subscription management clarifies entitlement, renewal, changes and cancellation.

## MUST
- SAAS-007.M1: Show current plan, billing period, next renewal and usage.

## SHOULD
- SAAS-007.S1: Explain effective date and access/data impact of changes.

## AVOID
- SAAS-007.A1: Do not hide cancellation behind unrelated offers.

## DECIDE
| Situation | Decision |
|---|---|
| Plan change | State effective date and access |
| Cancellation | Make discoverable, no dark pattern |
| Renewal | Notify before charge |

## STATES
- Active
- Trial
- Past due
- Cancelled
- Expired
- Error

## EXAMPLE
Good: Cancel at period end on 30 June; access remains until then. Bad: Cancel button hidden in settings submenu.

## FAILURE MODES
- Hidden cancellation traps users; make discoverable.
- Ambiguous effective dates cause disputes; state exact date.
- Usage/entitlement unclear; show current plan and usage.

## CHECK
- [ ] Dates explicit?
- [ ] Effective date clear?
- [ ] Cancellation discoverable?

## SOURCE NOTES
- [FTC Click-to-Cancel Rule](https://www.ftc.gov/news-events/news/press-releases/2024/10/federal-trade-commission-announces-final-click-cancel-rule-making-it-easier-consumers-end-recurring) — authoritative reference; this document paraphrases relevant guidance.
- [Deceptive Patterns (Brignull)](https://www.deceptive.design/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `SAAS-006` — retrieve when the feature crosses into this topic.
- `CW-004` — retrieve when the feature crosses into this topic.
- `EVAL-006` — retrieve when the feature crosses into this topic.
- `INT-007` — retrieve when the feature crosses into this topic.