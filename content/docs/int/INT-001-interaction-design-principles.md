---
id: INT-001
title: "Interaction Design Principles"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [audit, proposal, critique, implement]
tags: [interaction-design-principles, interaction]
applies_to: [web, mobile]
related: [UX-005, EVAL-001, INT-004, INT-006]
sources:
  - name: "NN/g First Principles of Interaction Design"
    url: "https://www.nngroup.com/articles/first-principles-interaction-design/"
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-15
---

# INT-001 — Interaction Design Principles

## Summary
Every interaction must expose a discoverable trigger, visible response, predictable result and a recovery path; design for the task outcome, not the screen.

## MUST
- INT-001.M1: Define trigger, feedback, resulting state and recovery path for every action before implementation.
- INT-001.M2: Keep the interaction operable by keyboard, touch and assistive tech; never depend on a single modality.
- INT-001.M3: Preserve user input and context when an action fails or is cancelled.

## SHOULD
- INT-001.S1: Make state changes visible within 100 ms and keep transitions interruptible.
- INT-001.S2: Offer undo for reversible actions and confirmation only for irreversible or high-impact ones.

## AVOID
- INT-001.A1: Do not make motion, sound or hidden gestures the only way to operate a feature.
- INT-001.A2: Do not ship an interaction whose success cannot be verified against a defined user outcome.

## DECIDE
| Situation | Decision |
|---|---|
| Immediate and reversible | Update UI and offer undo |
| Asynchronous | Show honest, cancellable progress |
| Irreversible or high impact | Explain consequence and require explicit confirm |
| Failure | Preserve input and offer retry or recovery |

## STATES
- Idle
- Triggered
- Pending
- Success
- Failure
- Cancelled
- Recovered

## EXAMPLE
Good: "Save button shows spinner, then 'Saved' or 'Couldn't save — retry', keeping edits." Bad: "Button disables silently and the form resets on error."

## FAILURE MODES
- Hiding the recovery path turns a recoverable slip into data loss.
- Relying on one modality excludes keyboard and assistive-tech users.
- Unverified success states lead teams to ship interactions that look done but fail the task.

## CHECK
- [ ] Trigger and outcome documented?
- [ ] Feedback timing ≤100 ms?
- [ ] Recovery path exists and tested?
- [ ] Input preserved on failure?

## SOURCE NOTES
- [NN/g First Principles of Interaction Design](https://www.nngroup.com/articles/first-principles-interaction-design/) — authoritative reference; this document paraphrases relevant guidance.
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-005` — retrieve when the feature crosses into this topic.
- `EVAL-001` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
