---
id: SAAS-004
title: "Onboarding"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [research, proposal, critique, implement]
tags: [onboarding, saas]
applies_to: [web, mobile]
related: [SAAS-008, CW-004, UX-002, EVAL-008]
sources:
  - name: "NN/g Onboarding"
    url: "https://www.nngroup.com/articles/onboarding/"
  - name: "Apple HIG Onboarding"
    url: "https://developer.apple.com/design/human-interface-guidelines/onboarding"
updated: 2026-11-15
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
| User can act immediately | Skip tour |
| Optional info | Defer |
| Activation unclear | Define outcome metric |

## STATES
- First run
- In progress
- Activated
- Skipped
- Error
- Returning

## EXAMPLE
Good: Import one project and show a useful result before asking for every preference. Bad: 8-step tour before any action.

## FAILURE MODES
- Tours block action; let users act first.
- Activation defined as completion inflates success; define outcome.
- Excessive upfront data increases drop-off; defer optional.

## CHECK
- [ ] Activation outcome defined?
- [ ] Required setup minimal?
- [ ] Skip/defer safe?

## SOURCE NOTES
- [NN/g Onboarding](https://www.nngroup.com/articles/onboarding/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple HIG Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `SAAS-008` — retrieve when the feature crosses into this topic.
- `CW-004` — retrieve when the feature crosses into this topic.
- `UX-002` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.