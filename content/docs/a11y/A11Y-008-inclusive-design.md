---
id: A11Y-008
title: "Inclusive Design"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 1
priority: core
stages: [audit, proposal, critique, implement]
tags: [inclusive-design, accessibility]
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

# A11Y-008 — Inclusive Design

## Summary
Inclusive design identifies exclusion across ability, language, culture, device and context.

## MUST
- A11Y-008.M1: Define supported user/context range and test edge cases affecting task success.

## SHOULD
- A11Y-008.S1: Accept flexible input formats where data integrity permits.

## AVOID
- A11Y-008.A1: Do not infer identity or intent from names, appearance or demographics.

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
Accept phone numbers with country code and normalize punctuation.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Exclusion risks recorded?
- [ ] Input assumptions justified?
- [ ] Equivalent paths exist?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C Understanding Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-006` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `CMP-005` — retrieve when the feature crosses into this topic.
