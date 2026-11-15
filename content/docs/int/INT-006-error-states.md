---
id: INT-006
title: "Error States"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [audit, proposal, critique, implement]
tags: [error-states, interaction]
applies_to: [web, mobile]
related: [CW-003, INT-004, INT-005, INT-007]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "W3C WCAG 2.2 Understanding Error Identification"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html"
  - name: "NN/g Error-Message Guidelines"
    url: "https://www.nngroup.com/articles/error-message-guidelines/"
updated: 2026-11-15
---

# INT-006 — Error States

## Summary
Error states identify the problem, preserve work and provide a feasible recovery action; message copy details live in CW-003.

## MUST
- INT-006.M1: Explain failure in user language and give a concrete next step.
- INT-006.M2: Preserve valid values and move focus to the error summary or first invalid field after failed submit.
- INT-006.M3: Announce errors to assistive tech (aria-live or focus move) without relying on color alone.

## SHOULD
- INT-006.S1: Show inline errors adjacent to the source and a summary for multiple errors.
- INT-006.S2: Distinguish blocking errors from warnings and non-blocking status.

## AVOID
- INT-006.A1: Do not expose stack traces, internal codes or blame the user.
- INT-006.A2: Do not clear valid input or reset the form on error.

## DECIDE
| Situation | Decision |
|---|---|
| Single field error | Inline message + focus field |
| Multiple errors | Summary + focus first invalid field |
| Recoverable failure | Preserve input and offer retry |
| Blocking vs warning | Reserve modal for severe, blocking errors |

## STATES
- Idle
- Validating
- Error
- Warning
- Recovering
- Recovered
- Failed

## EXAMPLE
Good: "'We couldn't save. Your edits are still here. Try again.' Focus moves to the summary; inputs retained." Bad: "'Error 500' toast, form cleared, focus lost."

## FAILURE MODES
- Clearing valid input forces rework and abandonment.
- Unannounced errors are invisible to screen-reader users.
- Modal errors for minor issues interrupt flow unnecessarily.

## CHECK
- [ ] Cause specific?
- [ ] Recovery feasible?
- [ ] Input retained?
- [ ] Error announced?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `CW-003` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `INT-005` — retrieve when the feature crosses into this topic.
- `INT-007` — retrieve when the feature crosses into this topic.
