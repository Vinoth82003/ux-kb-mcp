---
id: SAAS-008
title: "Empty Dashboard States"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [research, proposal, critique, implement]
tags: [empty-dashboard-states, saas]
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

# SAAS-008 — Empty Dashboard States

## Summary
An empty dashboard distinguishes setup incomplete, no activity, no permission and unavailable data.

## MUST
- SAAS-008.M1: State the real reason and the next action that resolves it.

## SHOULD
- SAAS-008.S1: Clearly label demo data and isolate it from production metrics.

## AVOID
- SAAS-008.A1: Do not show blank charts, fake zeros or misleading summaries.

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
Connect your bank account only if that is truly required.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Reason accurate?
- [ ] Setup action clear?
- [ ] Demo data isolated?

## SOURCE NOTES
- [NN/g Dashboard Design](https://www.nngroup.com/articles/dashboard-design/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Onboarding](https://www.nngroup.com/articles/onboarding/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-002` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `CW-001` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.
