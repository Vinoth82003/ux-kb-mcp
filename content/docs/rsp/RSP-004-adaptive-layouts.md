---
id: RSP-004
title: "Adaptive Layouts"
domain: responsive
group: M05
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [adaptive-layouts, responsive]
applies_to: [web, mobile]
related: [RSP-001, RSP-003, VIS-004, CMP-006]
sources:
  - name: "NN/g Responsive Web Design"
    url: "https://www.nngroup.com/articles/responsive-web-design-definition/"
  - name: "MDN Responsive web design"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design"
  - name: "web.dev Responsive design basics"
    url: "https://web.dev/responsive-web-design-basics/"
updated: 2026-11-15
---

# RSP-004 — Adaptive Layouts

## Summary
Adaptive layouts switch patterns when a different arrangement is more usable than fluid resizing, while preserving task and content parity.

## MUST
- RSP-004.M1: Change pattern only when task constraints justify it.

## SHOULD
- RSP-004.S1: Keep content order, naming and action semantics consistent.

## AVOID
- RSP-004.A1: Do not remove data or change action meaning between variants.

## DECIDE
| Situation | Decision |
|---|---|
| Fluid layout works | Keep fluid |
| Pattern switch needed | Document justification + parity |
| Content parity risk | Keep same labels/data |
| Mobile constraint | Preserve targets and labels |

## STATES
- Desktop variant
- Mobile variant
- Transition point
- Degraded/empty
- Error
- Loading

## EXAMPLE
Good: "Mobile record view keeps sort and all essential fields from desktop grid." Bad: "Mobile drops the Delete action and renames Export to Download."

## FAILURE MODES
- Adaptive variants drift in labels and actions.
- Hidden data on mobile breaks task completion.
- Pattern switches without user expectation cause disorientation.
- Parity not documented; regressions slip.

## CHECK
- [ ] Task still achievable?
- [ ] Content parity documented?
- [ ] Alternate pattern tested?

## SOURCE NOTES
- [NN/g Responsive Web Design](https://www.nngroup.com/articles/responsive-web-design-definition/) — authoritative reference; this document paraphrases relevant guidance.
- [MDN Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) — authoritative reference; this document paraphrases relevant guidance.
- [web.dev Responsive design basics](https://web.dev/responsive-web-design-basics/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `RSP-001` — retrieve when the feature crosses into this topic.
- `RSP-003` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `CMP-006` — retrieve when the feature crosses into this topic.