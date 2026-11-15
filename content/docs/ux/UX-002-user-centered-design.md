---
id: UX-002
title: "User-Centered Design"
domain: ux
group: M01
type: principle
status: reviewed
rev: 2
priority: core
stages: [need_check, research, audit, proposal]
tags: [user-centered-design, ux]
applies_to: [web, mobile]
related: [UX-001, UX-003, UX-004, EVAL-007]
sources:
  - name: "ISO 9241-210:2019 Human-centred design for interactive systems"
    url: "https://www.iso.org/standard/77520.html"
  - name: "Nielsen Norman Group — When to Use Which User-Experience Research Methods"
    url: "https://www.nngroup.com/articles/which-ux-research-methods/"
  - name: "GOV.UK Service Manual — User research"
    url: "https://www.gov.uk/service-manual/user-research"
updated: 2026-11-15
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
| Need or problem unknown | Interview or observe users in context |
| Workflow known, usability unknown | Run task-based usability test |
| Prevalence or priority unknown | Survey after exploratory research |

## STATES
- Recruit
- Consent
- Task
- Observation
- Synthesis

## EXAMPLE
Ask participants to locate an overdue invoice rather than asking whether they like a dashboard.

## FAILURE MODES
- Recruiting people who do not match the real task or context produces findings that do not transfer.
- Leading questions validate a preferred solution instead of revealing user needs.
- Summative metrics without formative insight leave the cause of failure unexplained.

## CHECK
- [ ] Method matches question?
- [ ] Participants match task?
- [ ] Findings include evidence and confidence?

## SOURCE NOTES
- [ISO 9241-210:2019 Human-centred design for interactive systems](https://www.iso.org/standard/77520.html) — authoritative reference; this document paraphrases relevant guidance.
- [Nielsen Norman Group — When to Use Which User-Experience Research Methods](https://www.nngroup.com/articles/which-ux-research-methods/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Service Manual — User research](https://www.gov.uk/service-manual/user-research) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-001` — retrieve when the feature crosses into this topic.
- `UX-003` — retrieve when the feature crosses into this topic.
- `UX-004` — retrieve when the feature crosses into this topic.
- `EVAL-007` — retrieve when the feature crosses into this topic.
