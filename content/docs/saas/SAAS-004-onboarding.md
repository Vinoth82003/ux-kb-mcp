---
id: SAAS-004
title: "Onboarding"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [research, proposal, critique, implement]
tags: [onboarding, saas]
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

# SAAS-004 — Onboarding

## Summary
Onboarding helps users reach first meaningful value while learning only what is needed next.

## MUST
- SAAS-004.M1: Define activation as user outcome, not tutorial completion.

## SHOULD
- SAAS-004.S1: Ask only for information needed now; defer optional configuration.

## AVOID
- SAAS-004.A1: Do not force tours before users can act.

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
Import one project and show a useful result before asking for every preference.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Activation outcome defined?
- [ ] Required setup minimal?
- [ ] Skip/defer safe?

## SOURCE NOTES
- [NN/g Dashboard Design](https://www.nngroup.com/articles/dashboard-design/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Onboarding](https://www.nngroup.com/articles/onboarding/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-002` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `CW-001` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.
