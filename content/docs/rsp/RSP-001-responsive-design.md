---
id: RSP-001
title: "Responsive Design"
domain: responsive
group: M05
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [proposal, critique, implement]
tags: [responsive-design, responsive]
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

# RSP-001 — Responsive Design

## Summary
Responsive design adapts to available space, input and content—not device names alone.

## MUST
- RSP-001.M1: Choose breakpoints where the current layout fails; test narrow widths, zoom and orientation.

## SHOULD
- RSP-001.S1: Preserve task priority and content order.

## AVOID
- RSP-001.A1: Do not shrink desktop columns until text and controls become unusable.

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
Two-column settings becomes one ordered column before labels collide.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Content reflows?
- [ ] Breakpoints content-driven?
- [ ] No unintended page scroll?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `CMP-006` — retrieve when the feature crosses into this topic.
