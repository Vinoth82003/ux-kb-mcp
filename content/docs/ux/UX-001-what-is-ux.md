---
id: UX-001
title: "What Is UX"
domain: ux
group: M01
type: principle
status: reviewed
rev: 2
priority: core
stages: [need_check, research, audit]
tags: [what-is-ux, ux]
applies_to: [web, mobile]
related: [UX-002, UX-005, EVAL-007]
sources:
  - name: "Nielsen Norman Group — The Definition of User Experience (UX)"
    url: "https://www.nngroup.com/articles/definition-user-experience/"
  - name: "ISO 9241-210:2019 Human-centred design for interactive systems"
    url: "https://www.iso.org/standard/77520.html"
updated: 2026-11-15
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
| User, task or context unknown | Research before proposing screens |
| Evidence and assumption blurred | Label each and name a validation method |
| Journey has a gap (discovery, recovery, post-task) | Map and improve the full path |

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
- Optimizing one touchpoint while ignoring discovery or recovery leaves the end-to-end journey broken.
- Personas or metrics invented without evidence produce decisions that do not match real users.

## CHECK
- [ ] User and task explicit?
- [ ] Success measurable?
- [ ] Evidence separated from assumptions?

## SOURCE NOTES
- [Nielsen Norman Group — The Definition of User Experience (UX)](https://www.nngroup.com/articles/definition-user-experience/) — authoritative reference; this document paraphrases relevant guidance.
- [ISO 9241-210:2019 Human-centred design for interactive systems](https://www.iso.org/standard/77520.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-002` — retrieve when the feature crosses into this topic.
- `UX-005` — retrieve when the feature crosses into this topic.
- `EVAL-007` — retrieve when the feature crosses into this topic.
