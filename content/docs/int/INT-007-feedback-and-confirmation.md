---
id: INT-007
title: "Feedback and Confirmation"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [audit, proposal, critique, implement]
tags: [feedback-and-confirmation, interaction]
applies_to: [web, mobile]
related: [INT-001, INT-005, INT-006, CMP-010]
sources:
  - name: "NN/g Confirmation Dialog"
    url: "https://www.nngroup.com/articles/confirmation-dialog/"
  - name: "NN/g Visibility of System Status"
    url: "https://www.nngroup.com/articles/visibility-system-status/"
  - name: "W3C WCAG 2.2 Understanding Status Messages"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
updated: 2026-11-15
---

# INT-007 — Feedback and Confirmation

## Summary
Feedback closes the loop so users know whether an action was accepted, processing or rejected; match the message to backend truth.

## MUST
- INT-007.M1: Acknowledge state-changing actions and distinguish queued, processing and completed.
- INT-007.M2: Show success only after backend confirmation; otherwise show processing or queued.
- INT-007.M3: Make the feedback perceivable (visual plus, where useful, assistive announcement).

## SHOULD
- INT-007.S1: Use undo for reversible low-risk actions when safer than confirmation.
- INT-007.S2: Show feedback within 100 ms and keep it visible long enough to read (≥3 s for toasts).

## AVOID
- INT-007.A1: Do not show success before backend confirmation.
- INT-007.A2: Do not overuse confirmation dialogs for reversible, low-risk actions.

## DECIDE
| Situation | Decision |
|---|---|
| Immediate and reversible | Update and offer undo (5–10 s) |
| Asynchronous | Show honest progress |
| Irreversible | Explain before commit |
| High risk | Require explicit confirmation |

## STATES
- Idle
- Queued
- Processing
- Success
- Failure
- Reverted

## EXAMPLE
Good: "After archive, status reads 'Archived' with Undo for 8 s; Undo truly restores." Bad: "Toast says 'Done' before save completes, with no undo."

## FAILURE MODES
- Premature success messages hide failures and break trust.
- Missing undo forces heavy confirmation dialogs for trivial actions.
- Feedback that disappears too quickly is missed by slow readers and screen readers.

## CHECK
- [ ] Feedback matches backend?
- [ ] Reversibility considered?
- [ ] Confirmation proportional?
- [ ] Feedback visible ≥3 s?

## SOURCE NOTES
- [NN/g Confirmation Dialog](https://www.nngroup.com/articles/confirmation-dialog/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Visibility of System Status](https://www.nngroup.com/articles/visibility-system-status/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `INT-001` — retrieve when the feature crosses into this topic.
- `INT-005` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
- `CMP-010` — retrieve when the feature crosses into this topic.
