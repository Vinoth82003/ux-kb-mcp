---
id: SAAS-003
title: "Analytics UX"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [research, proposal, critique, implement]
tags: [analytics-ux, saas]
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

# SAAS-003 — Analytics UX

## Summary
Analytics interfaces make metric definitions, filters, attribution and uncertainty inspectable.

## MUST
- SAAS-003.M1: Expose formulas/windows for non-obvious metrics.

## SHOULD
- SAAS-003.S1: Distinguish zero, missing, delayed and unavailable data.

## AVOID
- SAAS-003.A1: Do not imply causation from correlation or hide denominator changes.

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
12% conversion states 120 of 1,000 eligible visitors.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Formula discoverable?
- [ ] Filters/cohort visible?
- [ ] Missing not shown as zero?

## SOURCE NOTES
- [NN/g Dashboard Design](https://www.nngroup.com/articles/dashboard-design/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Onboarding](https://www.nngroup.com/articles/onboarding/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-002` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `CW-001` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.
