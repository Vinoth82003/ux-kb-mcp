---
id: SAAS-008
title: "Empty Dashboard States"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [research, proposal, critique, implement]
tags: [empty-dashboard-states, saas]
applies_to: [web, mobile]
related: [SAAS-001, SAAS-003, CW-004, SAAS-004]
sources:
  - name: "NN/g Empty State Interface Design"
    url: "https://www.nngroup.com/articles/empty-state-interface-design/"
  - name: "Material Design Empty States"
    url: "https://m2.material.io/design/communication/empty-states.html"
updated: 2026-11-15
---

# SAAS-008 — Empty Dashboard States

## Summary
An empty dashboard distinguishes setup incomplete, no activity, no permission and unavailable data.

## MUST
- SAAS-008.M1: State the real reason and the next action that resolves it.

## SHOULD
- SAAS-008.S1: Clearly label demo data and isolate it from production metrics.

## AVOID
- SAAS-008.A1: Do not show blank charts, fake zeros or misleading summaries.

## DECIDE
| Situation | Decision |
|---|---|
| Setup incomplete | Show minimum next step |
| No permission | Explain and request access |
| Demo data | Label and isolate |

## STATES
- Setup incomplete
- No activity
- Filtered empty
- No permission
- Unavailable
- Error

## EXAMPLE
Good: "No invoices yet — create your first" with a Create action. Bad: Blank chart reading 0 with no reason or action.

## FAILURE MODES
- Blank charts imply zero; state the reason.
- Fake zeros mislead; distinguish missing/unavailable.
- Demo data mixed with production; label and isolate.

## CHECK
- [ ] Reason accurate?
- [ ] Setup action clear?
- [ ] Demo data isolated?

## SOURCE NOTES
- [NN/g Empty State Interface Design](https://www.nngroup.com/articles/empty-state-interface-design/) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design Empty States](https://m2.material.io/design/communication/empty-states.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `SAAS-001` — retrieve when the feature crosses into this topic.
- `SAAS-003` — retrieve when the feature crosses into this topic.
- `CW-004` — retrieve when the feature crosses into this topic.
- `SAAS-004` — retrieve when the feature crosses into this topic.