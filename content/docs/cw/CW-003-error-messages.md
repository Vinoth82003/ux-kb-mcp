---
id: CW-003
title: "Error Messages"
domain: content_writing
group: M07
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [error-messages, content-writing]
applies_to: [web, mobile]
related: [CW-001, INT-006, CMP-002, A11Y-007]
sources:
  - name: "NN/g Error-Message Guidelines"
    url: "https://www.nngroup.com/articles/error-message-guidelines/"
  - name: "GOV.UK Error Message"
    url: "https://design-system.service.gov.uk/components/error-message/"
  - name: "W3C WCAG 2.2 Understanding Error Identification"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html"
updated: 2026-11-15
---

# CW-003 — Error Messages

## Summary
Error copy states what happened, impact and the next feasible action; message wording lives here, while error state behavior lives in INT-006.

## MUST
- CW-003.M1: Use plain language and name the specific correction.
- CW-003.M2: Preserve the user's input and state what was retained.

## SHOULD
- CW-003.S1: Give one clear recovery action; include format or range examples.
- CW-003.S2: Use calm, non-blaming tone; avoid "invalid" or "illegal".

## AVOID
- CW-003.A1: Avoid raw codes, vague messages without next steps and blame.
- CW-003.A2: Avoid offering multiple possible fixes in one message; split or prioritize.

## DECIDE
| Situation | Decision |
|---|---|
| Single field | Inline message names the field and the fix |
| Multiple errors | Summary lists all errors; focus moves to the first |
| System failure | Explain status, retry option and support link |
| Permission failure | State missing access and the request path |

## STATES
- Detected
- Inline
- Summary
- Recovering
- Recovered
- Failed

## EXAMPLE
Good: "Enter a date after 1 January 2025." Bad: "Invalid date."

## FAILURE MODES
- Vague messages force users to guess the fix.
- Raw codes without explanation block recovery.
- Cleared inputs force rework and abandonment.
- Blaming language increases frustration and drop-off.

## CHECK
- [ ] Problem specific?
- [ ] Recovery feasible?
- [ ] Input intact?
- [ ] Programmatically associated?
- [ ] Tone non-blaming?

## SOURCE NOTES
- [NN/g Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `CW-001` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `A11Y-007` — retrieve when the feature crosses into this topic.