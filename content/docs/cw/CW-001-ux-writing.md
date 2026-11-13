---
id: CW-001
title: "UX Writing"
domain: content_writing
group: M07
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [ux-writing, content-writing]
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

# CW-001 — UX Writing

## Summary
UX writing helps users understand tasks, decisions and recovery through concise language.

## MUST
- CW-001.M1: Use user goals and outcomes rather than internal system names.

## SHOULD
- CW-001.S1: Keep terminology consistent for the same object/action.

## AVOID
- CW-001.A1: Avoid promotional filler and cleverness that hides meaning.

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
Download invoice is clearer than Get it.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Task named?
- [ ] Terminology consistent?
- [ ] Audience language appropriate?

## SOURCE NOTES
- [NN/g Writing for the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-007` — retrieve when the feature crosses into this topic.
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
