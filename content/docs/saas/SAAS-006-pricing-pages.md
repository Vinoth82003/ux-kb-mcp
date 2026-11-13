---
id: SAAS-006
title: "Pricing Pages"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [research, proposal, critique, implement]
tags: [pricing-pages, saas]
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
Show monthly/annual billing and included seats.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Total cost drivers visible?
- [ ] Plan differences clear?
- [ ] Claims verified?

## SOURCE NOTES
- [NN/g Dashboard Design](https://www.nngroup.com/articles/dashboard-design/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Onboarding](https://www.nngroup.com/articles/onboarding/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-002` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `CW-001` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.
