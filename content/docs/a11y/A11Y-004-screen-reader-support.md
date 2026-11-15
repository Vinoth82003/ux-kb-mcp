---
id: A11Y-004
title: "Screen Reader Support"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [screen-reader-support, accessibility]
applies_to: [web, mobile]
related: [A11Y-005, A11Y-006, CMP-002, CMP-010]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "W3C Understanding Name, Role, Value"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html"
  - name: "W3C WAI-ARIA 1.2"
    url: "https://www.w3.org/TR/wai-aria-1.2/"
updated: 2026-11-15
---

# A11Y-004 — Screen Reader Support

## Summary
Screen-reader usability depends on names, roles, values, structure, order and timely announcements.

## MUST
- A11Y-004.M1: Expose semantic headings, landmarks, labels, table headers and control states.
- A11Y-004.M2: SC 4.1.2: name, role and value programmatically determinable and updated.
- A11Y-004.M3: Announce dynamic status or result changes without unnecessary focus movement.

## SHOULD
- A11Y-004.S1: Use live regions for async status; keep messages concise.
- A11Y-004.S2: Test with at least one screen reader and keyboard only.

## AVOID
- A11Y-004.A1: Do not use ARIA to recreate native semantics unnecessarily.
- A11Y-004.A2: Do not announce every change or move focus on status updates.

## DECIDE
| Situation | Decision |
|---|---|
| Native semantics sufficient | Do not add ARIA |
| Dynamic content changes | Announce via live region |
| Complex widget | Use APG pattern and test |

## STATES
- Initial load
- Navigation
- Form interaction
- Async update
- Error announcement
- Modal/dialog

## EXAMPLE
Good: "After filtering, announce '12 results' via polite live region." Bad: "Silent filter update with focus unchanged."

## FAILURE MODES
- Missing labels make controls announced as "button".
- Dynamic updates are not announced.
- Overuse of ARIA overrides native semantics.

## CHECK
- [ ] Reading order correct?
- [ ] Name/role/value?
- [ ] Dynamic status announced?
- [ ] Tested with screen reader?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C Understanding Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `A11Y-005` — retrieve when the feature crosses into this topic.
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `CMP-010` — retrieve when the feature crosses into this topic.
