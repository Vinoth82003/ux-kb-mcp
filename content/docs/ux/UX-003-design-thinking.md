---
id: UX-003
title: "Design Thinking"
domain: ux
group: M01
type: principle
status: reviewed
rev: 1
priority: standard
stages: [need_check, research, proposal]
tags: [design-thinking, ux]
applies_to: [web, mobile]
related: [UX-002, UX-004, EVAL-007]
sources:
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
updated: 2026-11-12
---

# UX-003 — Design Thinking

## Summary
Design thinking is iterative problem-framing and experimentation; its purpose is reducing uncertainty, not completing a ceremonial sequence.

## MUST
- UX-003.M1: Frame the problem as a user outcome.
- UX-003.M2: Generate materially different concepts before selection.
- UX-003.M3: Prototype the riskiest assumption at the lowest useful fidelity.

## SHOULD
- UX-003.S1: Reframe when evidence invalidates the problem statement.
- UX-003.S2: Define in advance what experiment result changes the design.

## AVOID
- UX-003.A1: Run workshops without testable outputs.
- UX-003.A2: Equate idea volume with validated innovation.

## DECIDE
| Situation | Decision |
|---|---|
| Problem uncertain | Research and reframe |
| Solution uncertain | Prototype alternatives |
| Feasibility uncertain | Run technical spike |

## STATES
- Empathize
- Define
- Ideate
- Prototype
- Test
- Reframe

## EXAMPLE
Test a two-step approval model with a paper prototype before polishing the complete workflow.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Problem evidence-backed?
- [ ] Distinct concepts compared?
- [ ] Prototype tests a named assumption?

## SOURCE NOTES
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-002` — retrieve when the feature crosses into this topic.
- `UX-004` — retrieve when the feature crosses into this topic.
- `EVAL-007` — retrieve when the feature crosses into this topic.
