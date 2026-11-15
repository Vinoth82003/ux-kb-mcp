---
id: RSP-006
title: "Mobile Navigation"
domain: responsive
group: M05
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [mobile-navigation, responsive]
applies_to: [web, mobile]
related: [CMP-006, RSP-005, A11Y-003, INT-004]
sources:
  - name: "NN/g Basic Patterns for Mobile Navigation"
    url: "https://www.nngroup.com/articles/mobile-navigation-patterns/"
  - name: "Apple HIG Tab Bars"
    url: "https://developer.apple.com/design/human-interface-guidelines/tab-bars"
  - name: "Material Design Navigation Bar"
    url: "https://m3.material.io/components/navigation-bar/overview"
updated: 2026-11-15
---

# RSP-006 — Mobile Navigation

## Summary
Mobile navigation must expose location, destinations and backtracking without consuming the task area; use bottom nav for 3–5 high-frequency destinations only.

## MUST
- RSP-006.M1: Keep current location visible and provide consistent access to top-level destinations.

## SHOULD
- RSP-006.S1: Use bottom nav for 3–5 high-frequency destinations only.
- RSP-006.S2: Prefer labeled icons and persistent placement for primary destinations.

## AVOID
- RSP-006.A1: Do not hide sections behind unlabeled icons or rely on browser Back alone.
- RSP-006.A2: Do not exceed 5 bottom-nav destinations; overflow into a menu.

## DECIDE
| Situation | Decision |
|---|---|
| 3–5 top destinations | Bottom nav with labels |
| More than 5 destinations | Hamburger/menu or hub |
| Task-oriented flow | Hub/homepage navigation |
| Deep page | Provide visible Back and location |

## STATES
- Default location
- Scrolled
- Active destination
- Menu open
- Back available
- Error/offline

## EXAMPLE
Good: "Four labeled destinations (Home, Search, Saved, Profile) in bottom nav; current tab marked." Bad: "Six unlabeled icons in bottom nav plus browser Back only."

## FAILURE MODES
- Unlabeled icons reduce discoverability and recognition.
- More than 5 destinations shrink targets and hide options.
- Hidden navigation makes wayfinding and backtracking fail.
- Relying on browser Back loses input and context.

## CHECK
- [ ] Current section clear?
- [ ] Labels understandable?
- [ ] Back preserves input?
- [ ] Destination count 3–5?

## SOURCE NOTES
- [NN/g Basic Patterns for Mobile Navigation](https://www.nngroup.com/articles/mobile-navigation-patterns/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple HIG Tab Bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design Navigation Bar](https://m3.material.io/components/navigation-bar/overview) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `CMP-006` — retrieve when the feature crosses into this topic.
- `RSP-005` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `INT-004` — retrieve when the feature crosses into this topic.