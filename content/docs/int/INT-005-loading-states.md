---
id: INT-005
title: "Loading States"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [audit, proposal, critique, implement]
tags: [loading-states, interaction]
applies_to: [web, mobile]
related: [INT-001, INT-006, INT-007, CMP-010]
sources:
  - name: "NN/g Progress Indicators"
    url: "https://www.nngroup.com/articles/progress-indicators/"
  - name: "NN/g Response Times: The 3 Important Limits"
    url: "https://www.nngroup.com/articles/response-times-3-important-limits/"
  - name: "W3C WCAG 2.2 Understanding Status Messages"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
updated: 2026-11-15
---

# INT-005 — Loading States

## Summary
Loading states tell users whether an operation started, is progressing and can be cancelled, without faking progress.

## MUST
- INT-005.M1: Use determinate progress only when measurable; otherwise label indeterminate progress.
- INT-005.M2: Prevent duplicate submissions and disable or relabel the triggering control during processing.
- INT-005.M3: Keep layout stable; avoid shifting content when loaders appear.

## SHOULD
- INT-005.S1: Show feedback within 100 ms; use spinners/skeletons for <1 s and progress bars for longer tasks.
- INT-005.S2: Provide cancel and retry for operations longer than 10 s.

## AVOID
- INT-005.A1: Do not invent percentages or leave controls apparently active during submission.
- INT-005.A2: Do not block the whole UI for partial or background operations.

## DECIDE
| Operation length | Decision |
|---|---|
| <100 ms | No loader; instant feedback |
| 100 ms–1 s | Indeterminate spinner or skeleton |
| 1–10 s | Determinate bar if measurable |
| >10 s | Progress + cancel + retry |

## STATES
- Idle
- Triggered
- Pending
- Progressing
- Success
- Failure
- Cancelled

## EXAMPLE
Good: "'Uploading 3 of 8 files' with a cancel button; button reads 'Uploading…' and is disabled." Bad: "Fake 73% bar and an active Submit button."

## FAILURE MODES
- Fake progress erodes trust when completion time differs.
- Active controls during submission cause duplicate requests.
- Layout shift from late loaders causes mis-clicks.

## CHECK
- [ ] Duplicate action prevented?
- [ ] Progress truthful?
- [ ] Cancel/retry defined?
- [ ] Layout stable?

## SOURCE NOTES
- [NN/g Progress Indicators](https://www.nngroup.com/articles/progress-indicators/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `INT-001` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
- `INT-007` — retrieve when the feature crosses into this topic.
- `CMP-010` — retrieve when the feature crosses into this topic.
