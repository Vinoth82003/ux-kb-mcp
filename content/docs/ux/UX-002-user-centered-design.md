---
id: UX-002
title: "User-Centered Design"
domain: ux
group: M01
type: principle
status: reviewed
rev: 1
priority: core
stages: [need_check, research, audit, proposal]
tags: [user-centered-design, ux]
applies_to: [web, mobile]
related: [UX-001, UX-001, EVAL-007]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "NN/g Form Design"
    url: "https://www.nngroup.com/articles/web-form-design/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-12
---

# UX-002 — User-Centered Design

## Summary
User-centered design makes user tasks and evidence authoritative while treating business and technical constraints as explicit inputs.

## MUST
- UX-002.M1: Write research questions before choosing methods.
- UX-002.M2: Recruit people who represent the real task and context.
- UX-002.M3: Trace major decisions to findings, constraints or labeled hypotheses.

## SHOULD
- UX-002.S1: Use formative research early and summative evaluation after design stabilizes.
- UX-002.S2: Include assistive technology in relevant research scenarios.

## AVOID
- UX-002.A1: Ask leading questions to validate a preferred solution.
- UX-002.A2: Treat stakeholder approval as proof of usability.

## DECIDE
| Situation | Decision |
|---|---|
| Need unknown | Interview or observe |
| Workflow known, usability unknown | Run task-based usability test |
| Prevalence unknown | Survey after exploratory research |

## STATES
- Recruit
- Consent
- Task
- Observation
- Synthesis

## EXAMPLE
Ask participants to locate an overdue invoice rather than asking whether they like a dashboard.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Method matches question?
- [ ] Participants match task?
- [ ] Findings include evidence and confidence?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-001` — retrieve when the feature crosses into this topic.
- `UX-001` — retrieve when the feature crosses into this topic.
- `EVAL-007` — retrieve when the feature crosses into this topic.
