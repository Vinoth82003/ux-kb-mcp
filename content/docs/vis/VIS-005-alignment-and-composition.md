---
id: VIS-005
title: "Alignment and Composition"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [alignment-and-composition, visual-design]
applies_to: [web, mobile]
related: [VIS-004, VIS-001, CMP-009, RSP-003]
sources:
  - name: "Nielsen Norman Group Alignment"
    url: "https://www.nngroup.com/articles/alignment/"
  - name: "Material Design 3 Layout"
    url: "https://m3.material.io/foundations/layout/understanding-layout/overview"
  - name: "W3C WCAG 2.2 Meaningful Sequence"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html"
updated: 2026-11-15
---

# VIS-005 — Alignment and Composition

## Summary
Alignment creates a shared structure that supports comparison and scanning.

## MUST
- VIS-005.M1: Align related labels, values and actions to deliberate, shared edges (grid or baseline).
- VIS-005.M2: Right-align numeric values and use tabular numerals; left-align row labels.

## SHOULD
- VIS-005.S1: Align form labels and inputs consistently (top or start) across a surface.
- VIS-005.S2: Use a grid with defined columns and gutters; keep baselines aligned for mixed content.
- VIS-005.S3: Preserve alignment order when reflowing responsively.

## AVOID
- VIS-005.A1: Do not center-align long body copy or dense data without a reason.
- VIS-005.A2: Ragged, inconsistent edges that create false groupings.
- VIS-005.A3: Turning comparison data into cards when cross-row scanning matters (see CMP-009).

## DECIDE
| Situation | Decision |
|---|---|
| Forms | Top-aligned labels, shared start edge |
| Numeric data | Right-aligned, tabular nums, units aligned |
| Mixed content | Baseline align; avoid mid-row vertical centering |
| Responsive | Stack preserving label/value relationship |

## STATES
- Default
- Dense data
- Responsive
- Empty
- Loading
- Error

## EXAMPLE
Good: "Invoice table: labels left, amounts right with tabular nums." Bad: "Amounts centered; labels right-aligned arbitrarily."

## FAILURE MODES
- Misalignment slows comparison and causes reading errors.
- Centered dense data breaks scanning.
- Reflow can detach labels from values.
- Inconsistent edges imply false grouping.

## CHECK
- [ ] Shared edges reinforce grouping?
- [ ] Numbers comparable?
- [ ] Responsive order preserved?
- [ ] Tabular nums for data?

## SOURCE NOTES
- [Nielsen Norman Group Alignment](https://www.nngroup.com/articles/alignment/) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design 3 Layout](https://m3.material.io/foundations/layout/understanding-layout/overview) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-004` — retrieve when the feature crosses into this topic.
- `VIS-001` — retrieve when the feature crosses into this topic.
- `CMP-009` — retrieve when the feature crosses into this topic.
- `RSP-003` — retrieve when the feature crosses into this topic.