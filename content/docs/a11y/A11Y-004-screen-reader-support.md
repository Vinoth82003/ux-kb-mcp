---
id: A11Y-004
title: "Screen Reader Support"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 1
priority: core
stages: [audit, proposal, critique, implement]
tags: [screen-reader-support, accessibility]
applies_to: [web, mobile]
related: [VIS-006, INT-004, CMP-002, CMP-005]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "W3C WCAG 2.2 Quick Reference"
    url: "https://www.w3.org/WAI/WCAG22/quickref/"
  - name: "W3C Understanding Focus Appearance"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html"
updated: 2026-11-12
---

# A11Y-004 — Screen Reader Support

## Summary
Screen-reader usability depends on names, roles, values, structure, order and timely announcements.

## MUST
- A11Y-004.M1: Expose semantic headings, landmarks, labels, table headers and control states.

## SHOULD
- A11Y-004.S1: Announce asynchronous status without moving focus unnecessarily.

## AVOID
- A11Y-004.A1: Do not use ARIA to recreate native semantics unnecessarily.

## DECIDE
| Situation | Decision |
|---|---|
| Native element fits | Use native semantics |
| Custom widget needed | Follow pattern and test |
| Scan passes | Continue manual review |

## STATES
- Default
- Keyboard
- Screen reader
- Zoom/reflow
- Error
- High contrast/reduced motion

## EXAMPLE
After filtering, announce result count and keep focus predictable.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Reading order correct?
- [ ] Name/role/value?
- [ ] Dynamic status announced?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C Understanding Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-006` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `CMP-005` — retrieve when the feature crosses into this topic.
