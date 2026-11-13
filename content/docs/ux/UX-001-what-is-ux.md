---
id: UX-001
title: "What Is UX"
domain: ux
group: M01
type: principle
status: reviewed
rev: 1
priority: core
stages: [need_check, research, audit]
tags: [what-is-ux, ux]
applies_to: [web, mobile]
related: [UX-002, UX-005, EVAL-007]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-12
---

# UX-001 — What Is UX

## Summary
UX is the quality of the complete journey: usefulness, usability, accessibility, trust and context—not visual polish alone.

## MUST
- UX-001.M1: Define user, task, context and success outcome before proposing screens.
- UX-001.M2: Map discovery, entry, task completion, recovery and post-task touchpoints.
- UX-001.M3: Separate observed evidence from assumptions and name a validation method.

## SHOULD
- UX-001.S1: Measure task success, time, errors and confidence together.
- UX-001.S2: Include policy, data, support and device constraints.

## AVOID
- UX-001.A1: Treat stakeholder preference or visual polish as usability evidence.
- UX-001.A2: Invent personas, quotes or conversion metrics.

## DECIDE
| Situation | Decision |
|---|---|
| Need is evidenced | Build or improve the path |
| Need uncertain | Research before interface design |
| Duplicate feature | Compare task cost; recommend consolidation |

## STATES
- Discovery
- Entry
- In progress
- Success
- Failure/recovery
- Exit

## EXAMPLE
An invoice experience includes finding, understanding, downloading and recovering from failed downloads.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] User and task explicit?
- [ ] Success measurable?
- [ ] Evidence separated from assumptions?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-002` — retrieve when the feature crosses into this topic.
- `UX-005` — retrieve when the feature crosses into this topic.
- `EVAL-007` — retrieve when the feature crosses into this topic.
