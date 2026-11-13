---
id: CW-004
title: "Empty States"
domain: content_writing
group: M07
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [empty-states, content-writing]
applies_to: [web, mobile]
related: [A11Y-007, A11Y-005, INT-006, CMP-002]
sources:
  - name: "NN/g Writing for the Web"
    url: "https://www.nngroup.com/articles/how-users-read-on-the-web/"
  - name: "NN/g Form Design"
    url: "https://www.nngroup.com/articles/web-form-design/"
  - name: "GOV.UK Error Message"
    url: "https://design-system.service.gov.uk/components/error-message/"
updated: 2026-11-12
---

# CW-004 — Empty States

## Summary
Empty states distinguish first use, filtered no-results, no records, no permission and unavailable data.

## MUST
- CW-004.M1: Explain the actual reason and offer the action that resolves it.

## SHOULD
- CW-004.S1: Use demo data only when clearly labeled and isolated.

## AVOID
- CW-004.A1: Do not show fake zeros or imply records exist.

## DECIDE
| Situation | Decision |
|---|---|
| Before action | Explain requirement/consequence |
| During entry | Keep guidance adjacent |
| After error | Explain fix and preserve work |

## STATES
- Default
- Required/optional
- Validation
- Success
- Empty
- Localized

## EXAMPLE
No invoices match these filters differs from No invoices yet.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Reason accurate?
- [ ] Action matches reason?
- [ ] Demo data labeled?

## SOURCE NOTES
- [NN/g Writing for the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-007` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
