---
id: UX-004
title: "Double Diamond"
domain: ux
group: M01
type: principle
status: reviewed
rev: 1
priority: standard
stages: [need_check, research, proposal]
tags: [double-diamond, ux]
applies_to: [web, mobile]
related: [UX-002, UX-003, EVAL-007]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-12
---

# UX-004 — Double Diamond

## Summary
Double Diamond separates discovering the right problem from developing the right response, with divergence and evidence-based convergence.

## MUST
- UX-004.M1: Keep problem discovery separate from solution selection.
- UX-004.M2: Record evidence and criteria at each convergence point.
- UX-004.M3: Reopen discovery if testing invalidates the problem statement.

## SHOULD
- UX-004.S1: Use research synthesis, defined problem, tested concepts and validated direction as transition artifacts.

## AVOID
- UX-004.A1: Treat phases as a rigid waterfall.
- UX-004.A2: Use the diagram instead of research or testing.

## DECIDE
| Situation | Decision |
|---|---|
| Problem space uncertain | Discover broadly |
| Problem clear, solution unclear | Develop alternatives |
| Evidence conflicts | Return to discovery |

## STATES
- Discover
- Define
- Develop
- Deliver
- Feedback loop

## EXAMPLE
Find invoice-total confusion, narrow the problem to tax breakdown clarity, test alternatives, then deliver the validated pattern.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Problem and solution spaces distinct?
- [ ] Convergence criteria recorded?
- [ ] Feedback loops allowed?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-002` — retrieve when the feature crosses into this topic.
- `UX-003` — retrieve when the feature crosses into this topic.
- `EVAL-007` — retrieve when the feature crosses into this topic.
