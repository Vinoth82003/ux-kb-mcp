---
id: EVAL-003
title: "Fitts's Law"
domain: evaluation
group: M10
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, critique]
tags: [fitts-s-law, evaluation]
applies_to: [web, mobile]
related: [RSP-005, CMP-001, A11Y-003, INT-004]
sources:
  - name: "NN/g Fitts's Law"
    url: "https://www.nngroup.com/articles/fitts-law/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-15
---

# EVAL-003 — Fitts's Law

## Summary
Fitts predicts target acquisition time increases with distance and decreases as target size increases; treat as heuristic, not WCAG criterion (see RSP-005 for target sizes).

## MUST
- EVAL-003.M1: Make frequent/critical controls easy to acquire and near task context.

## SHOULD
- EVAL-003.S1: Separate adjacent targets and consider pointer/touch precision.

## AVOID
- EVAL-003.A1: Do not use Fitts to excuse WCAG target-size failure; meet RSP-005 (at least 24×24 CSS px).

## DECIDE
| Situation | Decision |
|---|---|
| Frequent action | Enlarge and bring near context |
| Dense toolbar | Increase separation or size |
| Touch input | Follow RSP-005 sizes |

## STATES
- Pointer
- Touch
- Keyboard
- Dense layout
- Mobile

## EXAMPLE
Good: Save button 44px hit area adjacent to edited field. Bad: 16px icon with no hit area 300px from field.

## FAILURE MODES
- Large targets can crowd layouts and hide hierarchy; balance size with grouping.
- Distance savings vanish if target is visually ambiguous; keep labels clear.
- Fitts ignores cognitive choice; pair with Hick (EVAL-004) for menus.

## CHECK
- [ ] Critical targets easy?
- [ ] Adjacent targets separated?
- [ ] WCAG checked independently?

## SOURCE NOTES
- [NN/g Fitts's Law](https://www.nngroup.com/articles/fitts-law/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `RSP-005` — retrieve when the feature crosses into this topic.
- `CMP-001` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.