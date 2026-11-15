---
id: SAAS-002
title: "Data Visualization"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [research, proposal, critique, implement]
tags: [data-visualization, saas]
applies_to: [web, mobile]
related: [SAAS-001, SAAS-003, A11Y-001, CMP-009]
sources:
  - name: "Apple HIG Charts"
    url: "https://developer.apple.com/design/human-interface-guidelines/charts"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-15
---

# SAAS-002 — Data Visualization

## Summary
Charts make comparison, trend, distribution or relationship easier than raw values.

## MUST
- SAAS-002.M1: Choose chart by analytical task; include units, labels and meaningful baseline.

## SHOULD
- SAAS-002.S1: Provide accessible summary or data alternative and non-color distinction.

## AVOID
- SAAS-002.A1: Avoid 3D effects and truncated axes that exaggerate differences.

## DECIDE
| Situation | Decision |
|---|---|
| Chart type unclear | Match chart to analytical task |
| Axis baseline risk | Start at zero or justify truncation |
| Color-only encoding | Add labels or patterns |

## STATES
- Loading
- Populated
- Empty series
- Filtered empty
- Error
- Accessible alternative

## EXAMPLE
Good: Revenue line chart states date range, currency and axis scale with table alternative. Bad: 3D pie chart with truncated axis and color-only legend.

## FAILURE MODES
- Truncated axes exaggerate differences; start at zero or justify.
- Color-only encoding excludes color-blind users; add labels/patterns.
- Missing text alternative blocks screen reader users; provide summary/table.

## CHECK
- [ ] Chart fits question?
- [ ] Units/baseline clear?
- [ ] Text alternative and non-color encoding?

## SOURCE NOTES
- [Apple HIG Charts](https://developer.apple.com/design/human-interface-guidelines/charts) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `SAAS-001` — retrieve when the feature crosses into this topic.
- `SAAS-003` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `CMP-009` — retrieve when the feature crosses into this topic.