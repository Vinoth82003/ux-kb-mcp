---
id: INT-004
title: "Focus Management"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [focus-management, interaction]
applies_to: [web, mobile]
related: [EVAL-001, A11Y-003, A11Y-006, INT-006]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "GOV.UK Error Message"
    url: "https://design-system.service.gov.uk/components/error-message/"
updated: 2026-11-12
---

# INT-004 — Focus Management

## Summary
Focus identifies the current keyboard point and must remain visible and logically ordered.

## MUST
- INT-004.M1: Preserve DOM order aligned with task order and visible focus.

## SHOULD
- INT-004.S1: Move focus deliberately after route changes, dialog open/close and dynamic validation.

## AVOID
- INT-004.A1: Do not remove outlines without a perceivable replacement or use positive tabindex.

## DECIDE
| Situation | Decision |
|---|---|
| Immediate/reversible | Update and offer undo if useful |
| Asynchronous | Show honest progress |
| Irreversible | Explain before commit |

## STATES
- Idle
- Triggered
- Pending
- Success
- Failure
- Cancelled

## EXAMPLE
After deleting a row, focus next row action or stable table heading.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Focus visible?
- [ ] Order logical?
- [ ] Dynamic changes preserve focus?
- [ ] Not obscured?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `EVAL-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
