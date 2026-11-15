---
id: RSP-002
title: "Mobile-First Design"
domain: responsive
group: M05
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [mobile-first-design, responsive]
applies_to: [web, mobile]
related: [RSP-001, RSP-005, RSP-006, A11Y-001]
sources:
  - name: "Luke Wroblewski Mobile First"
    url: "https://www.lukew.com/ff/entry.asp?933"
  - name: "NN/g Mobile User Experience"
    url: "https://www.nngroup.com/articles/mobile-ux/"
  - name: "MDN Responsive web design"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design"
updated: 2026-11-15
---

# RSP-002 — Mobile-First Design

## Summary
Mobile-first designs the smallest supported viewport around the primary task, then enhances for larger screens, touch and poor connectivity.

## MUST
- RSP-002.M1: Design the smallest supported viewport (320 CSS px) around the primary task.
- RSP-002.M2: Meet WCAG 2.2 AA SC 1.4.10 reflow on the mobile baseline.

## SHOULD
- RSP-002.S1: Account for thumb reach, interruptions and poor network.
- RSP-002.S2: Defer non-essential content and chrome; keep content-to-chrome ratio high.

## AVOID
- RSP-002.A1: Do not hide essential functions to preserve desktop composition.
- RSP-002.A2: Do not assume desktop interactions (hover, precise pointer) on touch.

## DECIDE
| Situation | Decision |
|---|---|
| Core task unclear on narrow | Cut chrome; keep task |
| Secondary content | Progressive disclosure |
| Poor connectivity | Reduce payloads; cache |
| Touch precision | Follow RSP-005 sizes |

## STATES
- Narrow baseline
- Interrupted session
- Offline/slow network
- Touch input
- Resumed task
- Wide enhancement

## EXAMPLE
Good: "Checkout shows amount, payment and confirm first; secondary promos collapse." Bad: "Primary Pay button hidden in a hamburger to keep hero image."

## FAILURE MODES
- Essential actions buried in menus on mobile.
- State lost on interruption; no resume path.
- Desktop-only hover reveals block mobile users.
- Heavy assets fail on slow networks.

## CHECK
- [ ] Core task works at 320 CSS px?
- [ ] Secondary content discoverable?
- [ ] Network constraints handled?
- [ ] State saved for interruptions?

## SOURCE NOTES
- [Luke Wroblewski Mobile First](https://www.lukew.com/ff/entry.asp?933) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Mobile User Experience](https://www.nngroup.com/articles/mobile-ux/) — authoritative reference; this document paraphrases relevant guidance.
- [MDN Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `RSP-001` — retrieve when the feature crosses into this topic.
- `RSP-005` — retrieve when the feature crosses into this topic.
- `RSP-006` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.