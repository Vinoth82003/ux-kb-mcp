---
id: SAAS-007
title: "Subscription Management"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [research, proposal, critique, implement]
tags: [subscription-management, saas]
applies_to: [web, mobile]
related: [UX-002, A11Y-001, CW-001, EVAL-008]
sources:
  - name: "NN/g Dashboard Design"
    url: "https://www.nngroup.com/articles/dashboard-design/"
  - name: "NN/g Onboarding"
    url: "https://www.nngroup.com/articles/onboarding/"
  - name: "NN/g Form Design"
    url: "https://www.nngroup.com/articles/web-form-design/"
updated: 2026-11-12
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
| Decision support | Prioritize metric/action |
| Setup incomplete | Offer minimum next step |
| High-risk billing action | Disclose consequence |

## STATES
- First use
- Populated
- Filtered empty
- No permission
- Stale/loading
- Error

## EXAMPLE
Cancel at period end on 30 June; access remains until then.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Dates explicit?
- [ ] Effective date clear?
- [ ] Cancellation discoverable?

## SOURCE NOTES
- [NN/g Dashboard Design](https://www.nngroup.com/articles/dashboard-design/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Onboarding](https://www.nngroup.com/articles/onboarding/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-002` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `CW-001` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.
