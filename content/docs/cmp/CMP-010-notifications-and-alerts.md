---
id: CMP-010
title: "Notifications and Alerts"
domain: components
group: M03
type: pattern
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [notifications-and-alerts, components]
applies_to: [web, mobile]
related: [A11Y-004, INT-005, INT-006, INT-007]
sources:
  - name: "GOV.UK Design System Components"
    url: "https://design-system.service.gov.uk/components/"
  - name: "GOV.UK Error Message"
    url: "https://design-system.service.gov.uk/components/error-message/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "W3C WCAG 2.2 Understanding Status Messages"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
updated: 2026-11-15
---

# CMP-010 — Notifications and Alerts

## Summary
Notifications communicate state changes at appropriate urgency and persistence.

## MUST
- CMP-010.M1: Match urgency to presentation: inline status, page banner or alert dialog; announce asynchronous updates (WCAG 4.1.3).
- CMP-010.M2: Use `role="status"` for non-urgent updates and `role="alert"` (or an alert dialog) for urgent interruptions.
- CMP-010.M3: Provide text plus icon/color and an actionable next step; do not rely on color alone.

## SHOULD
- CMP-010.S1: Use text plus icon/color and give actionable next steps.
- CMP-010.S2: Auto-dismiss only non-critical toasts; keep errors until dismissed.

## AVOID
- CMP-010.A1: Do not stack transient toasts or rely on color alone.
- CMP-010.A2: Do not use alert dialogs for minor status updates.

## DECIDE
| Situation | Decision |
|---|---|
| Success/info | role="status" live region |
| Error/urgent | role="alert" or alert dialog |
| Blocking failure | Modal alert dialog |
| Transient toast | Single, auto-dismiss, pausable |

## STATES
- Idle
- Pending
- Success
- Warning
- Error
- Dismissed
- Responsive

## EXAMPLE
Good: “Changes saved” status region; payment failure includes a next step and retry. Bad: “Error 500” toast, color-only, no action.

## FAILURE MODES
- Unannounced status changes are invisible to screen-reader users (WCAG 4.1.3).
- Stacked toasts overwhelm and obscure content.
- Color-only or vague messages fail recovery.

## CHECK
- [ ] Urgency matches presentation?
- [ ] role=status/alert used appropriately?
- [ ] Message says what happened?
- [ ] AT announcement exists?
- [ ] Actionable next step?

## SOURCE NOTES
- [GOV.UK Design System Components](https://design-system.service.gov.uk/components/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-004` — retrieve when the feature crosses into this topic.
- `INT-005` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
- `INT-007` — retrieve when the feature crosses into this topic.