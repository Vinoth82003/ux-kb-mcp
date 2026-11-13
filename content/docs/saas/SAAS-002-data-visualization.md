---
id: SAAS-002
title: "Data Visualization"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 1
priority: standard
stages: [research, proposal, critique, implement]
tags: [data-visualization, saas]
applies_to: [web, mobile]
related: [UX-002, A11Y-001, CW-001, EVAL-008]
sources:
  - name: "Apple HIG Charts"
    url: "https://developer.apple.com/design/human-interface-guidelines/charts"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
updated: 2026-11-12
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
| Decision support | Prioritize metric/action |
| Setup incomplete | Offer minimum next step |
| High-risk billing action | Disclose consequence |

## STATES
- First use
- Populated
- Filtered empty
- No permission
- Stale/loading
- Error

## EXAMPLE
Monthly revenue line chart states date range, currency and axis scale.

## FAILURE MODES
- A polished screen can still fail the task; validate against the defined user outcome.
- A heuristic is not a WCAG success criterion unless explicitly identified as one.
- If project context conflicts with this guidance, record the conflict and obtain an explicit decision.

## CHECK
- [ ] Chart fits question?
- [ ] Units/baseline clear?
- [ ] Text alternative and non-color encoding?

## SOURCE NOTES
- [Apple HIG Charts](https://developer.apple.com/design/human-interface-guidelines/charts) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-002` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.
- `CW-001` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.
