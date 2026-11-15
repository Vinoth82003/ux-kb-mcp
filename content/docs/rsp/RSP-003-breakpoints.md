---
id: RSP-003
title: "Breakpoints"
domain: responsive
group: M05
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [breakpoints, responsive]
applies_to: [web, mobile]
related: [RSP-001, RSP-004, VIS-004, A11Y-001]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "MDN Media queries"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
  - name: "Apple HIG Layout"
    url: "https://developer.apple.com/design/human-interface-guidelines/layout"
updated: 2026-11-15
---

# RSP-003 — Breakpoints

## Summary
Breakpoints are layout transitions chosen from component constraints and content behavior, not device widths.

## MUST
- RSP-003.M1: Document each breakpoint token and the layout change it triggers.

## SHOULD
- RSP-003.S1: Test just below and above every breakpoint with long/localized labels.

## AVOID
- RSP-003.A1: Do not copy device widths without a demonstrated need.

## DECIDE
| Situation | Decision |
|---|---|
| Content collides | Add breakpoint at failure point |
| Layout fits | Keep fluid; no breakpoint |
| Long localized labels | Re-test boundaries |
| Zoom/reflow | Verify at 320 CSS px |

## STATES
- Below breakpoint
- At breakpoint
- Above breakpoint
- Zoomed
- Localized content
- Orientation

## EXAMPLE
Good: "At 640 CSS px filters move to a drawer to preserve table width." Bad: "Breakpoints at 375/768/1024 because those are popular phones."

## FAILURE MODES
- Device-width breakpoints fail on in-between sizes.
- Unjustified breakpoints fragment CSS and testing.
- Long labels overflow just below a breakpoint.
- Zoom reveals missed boundary behavior.

## CHECK
- [ ] Every breakpoint justified?
- [ ] Boundary widths tested?
- [ ] Meaning preserved?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [MDN Media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries) — authoritative reference; this document paraphrases relevant guidance.
- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `RSP-001` — retrieve when the feature crosses into this topic.
- `RSP-004` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.