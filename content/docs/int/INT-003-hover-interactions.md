---
id: INT-003
title: "Hover Interactions"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [audit, proposal, critique, implement]
tags: [hover-interactions, interaction]
applies_to: [web, mobile]
related: [INT-001, INT-004, CMP-008, A11Y-003]
sources:
  - name: "NN/g Timing Guidelines for Exposing Hidden Content"
    url: "https://www.nngroup.com/articles/timing-exposing-content/"
  - name: "W3C WCAG 2.2 Understanding Content on Hover or Focus"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html"
  - name: "NN/g Tooltip Guidelines"
    url: "https://www.nngroup.com/articles/tooltip-guidelines/"
updated: 2026-11-15
---

# INT-003 — Hover Interactions

## Summary
Hover is a pointer enhancement that previews or reveals; it must never be the only way to reach an action or content.

## MUST
- INT-003.M1: Provide equivalent focus, click and touch behavior for every hover-revealed action.
- INT-003.M2: Keep hover content dismissible and available long enough to reach and read (WCAG 1.4.13).
- INT-003.M3: Do not move or obscure existing content when hover content appears.

## SHOULD
- INT-003.S1: Show affordance feedback (color, cursor) within 100 ms on hover.
- INT-003.S2: Delay hiding hover content by 300–500 ms after the pointer leaves to avoid accidental dismissal.

## AVOID
- INT-003.A1: Do not reveal essential controls only on hover.
- INT-003.A2: Do not trigger navigation or destructive actions on hover alone.

## DECIDE
| Situation | Decision |
|---|---|
| Hover reveals preview | Also expose on focus and click |
| Touch device | Use tap or long-press alternative |
| Content on hover | Dismissible, hoverable, persistent |
| Affordance feedback | ≤100 ms color/cursor change |

## STATES
- Default
- Hover
- Focus
- Revealed
- Dismissed
- Touch fallback

## EXAMPLE
Good: "Row menu appears on hover and focus, stays open while pointer is over it, and is reachable by tap." Bad: "Delete action appears only on hover with no keyboard or touch path."

## FAILURE MODES
- Hover-only controls are unreachable for keyboard and touch users.
- Hover content that disappears immediately causes repeated re-triggering.
- Hover-triggered navigation causes accidental page changes.

## CHECK
- [ ] Keyboard equivalent?
- [ ] Touch equivalent?
- [ ] Content dismissible and hoverable?
- [ ] Affordance feedback ≤100 ms?

## SOURCE NOTES
- [NN/g Timing Guidelines for Exposing Hidden Content](https://www.nngroup.com/articles/timing-exposing-content/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Tooltip Guidelines](https://www.nngroup.com/articles/tooltip-guidelines/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `INT-001` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.
- `CMP-008` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
