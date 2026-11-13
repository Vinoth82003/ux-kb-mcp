---
id: RSP-003
title: "Breakpoints"
domain: responsive
group: M05
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [breakpoints, responsive]
applies_to: [web, mobile]
related: [A11Y-001, A11Y-003, VIS-004, CMP-006]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "Apple HIG Layout"
    url: "https://developer.apple.com/design/human-interface-guidelines/layout"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
updated: 2026-11-12
---

# RSP-003 — Breakpoints

## Summary
Breakpoints are layout transitions chosen from component constraints and content behavior.

## MUST
- RSP-003.M1: Document each breakpoint token and the layout change it triggers.

## SHOULD
- RSP-003.S1: Test just below and above every breakpoint with long/localized labels.

## AVOID
- RSP-003.A1: Do not copy device widths without a demonstrated need.

## DECIDE
| Situation | Decision |
|---|---|
| Layout fits | Keep fluid |
| Content collides | Add breakpoint |
| Interaction changes | Test adaptive pattern |

## STATES
- Narrow
- Wide
- Zoom/reflow
- Orientation
- Touch/keyboard

## EXAMPLE
At a project-specific width, filters move to a drawer to preserve table width.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Every breakpoint justified?
- [ ] Boundary widths tested?
- [ ] Meaning preserved?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `CMP-006` — retrieve when the feature crosses into this topic.
