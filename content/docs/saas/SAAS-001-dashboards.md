---
id: SAAS-001
title: "Dashboards"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [research, proposal, critique, implement]
tags: [dashboards, saas]
applies_to: [web, mobile]
related: [SAAS-002, SAAS-003, SAAS-008, EVAL-008]
sources:
  - name: "NN/g Dashboard Design"
    url: "https://www.nngroup.com/articles/dashboard-design/"
  - name: "Tableau Dashboard Design"
    url: "https://www.tableau.com/learn/articles/dashboard-design"
updated: 2026-11-15
---

# SAAS-001 — Dashboards

## Summary
Dashboards support monitoring and decisions by prioritizing questions and actions.

## MUST
- SAAS-001.M1: Define audience, decisions and review cadence before selecting KPIs.

## SHOULD
- SAAS-001.S1: Show metric definition, time period, comparison baseline and freshness.

## AVOID
- SAAS-001.A1: Do not fill dashboards with vanity metrics or decorative charts.

## DECIDE
| Situation | Decision |
|---|---|
| No data yet | Show setup path or labeled demo data |
| Metric conflict | Prioritize decision/action over vanity totals |
| Stale data | Show freshness timestamp and refresh action |

## STATES
- First use
- Populated
- Filtered empty
- No permission
- Stale/loading
- Error

## EXAMPLE
Good: Overdue invoices card shows count, aging buckets and a Review action. Bad: Total users tile with no definition, period or next action.

## FAILURE MODES
- Vanity metrics displace decisions; validate each KPI against a user question.
- Stale data presented as current misleads; always show freshness.
- Dense charts without actions leave users stuck; provide next step.

## CHECK
- [ ] Each metric answers question?
- [ ] Period/freshness visible?
- [ ] Next action clear?

## SOURCE NOTES
- [NN/g Dashboard Design](https://www.nngroup.com/articles/dashboard-design/) — authoritative reference; this document paraphrases relevant guidance.
- [Tableau Dashboard Design](https://www.tableau.com/learn/articles/dashboard-design) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `SAAS-002` — retrieve when the feature crosses into this topic.
- `SAAS-003` — retrieve when the feature crosses into this topic.
- `SAAS-008` — retrieve when the feature crosses into this topic.
- `EVAL-008` — retrieve when the feature crosses into this topic.