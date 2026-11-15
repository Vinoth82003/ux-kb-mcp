---
id: INT-002
title: "Microinteractions"
domain: interaction
group: M04
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [audit, proposal, critique, implement]
tags: [microinteractions, interaction]
applies_to: [web, mobile]
related: [INT-001, INT-005, INT-007, A11Y-003]
sources:
  - name: "NN/g Microinteractions in User Experience"
    url: "https://www.nngroup.com/articles/microinteractions/"
  - name: "NN/g The Role of Animation and Motion in UX"
    url: "https://www.nngroup.com/articles/animation-purpose-ux/"
  - name: "W3C WCAG 2.2 Understanding Animation from Interactions"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html"
updated: 2026-11-15
---

# INT-002 — Microinteractions

## Summary
Microinteractions give immediate, single-purpose feedback around one trigger, rule and response; motion is a communication tool, not decoration.

## MUST
- INT-002.M1: Animate only when motion clarifies cause, state change or spatial continuity.
- INT-002.M2: Provide an equivalent non-motion cue (color, text, icon) for every animated state change.
- INT-002.M3: Respect prefers-reduced-motion by removing or replacing non-essential motion.

## SHOULD
- INT-002.S1: Keep routine feedback animations to 100–200 ms; reserve 200–300 ms for spatial transitions.
- INT-002.S2: Avoid delaying task completion; animation must not block input or navigation.

## AVOID
- INT-002.A1: Do not animate every hover, loading event or number by default.
- INT-002.A2: Do not use motion as the only signal of success, error or state change.

## DECIDE
| Situation | Decision |
|---|---|
| Triggered feedback | Animate state change ≤200 ms |
| Reduced motion requested | Remove motion, keep static cue |
| Spatial transition | Use 200–300 ms directional motion |
| Decorative delight | Omit unless it serves comprehension |

## STATES
- Idle
- Triggered
- Animating
- Success
- Failure
- Reduced motion

## EXAMPLE
Good: "Bookmark icon fills and 'Saved' appears in 120 ms; with reduced motion, only 'Saved' appears." Bad: "Heart pulses for 1.2 s on every tap and blocks repeated taps."

## FAILURE MODES
- Decorative motion competes with task content and slows completion.
- Missing reduced-motion handling excludes vestibular-sensitive users.
- Motion-only feedback is invisible to screen-reader and reduced-motion users.

## CHECK
- [ ] Motion communicates state?
- [ ] Reduced motion respected?
- [ ] Non-motion feedback exists?
- [ ] Duration ≤300 ms for routine feedback?

## SOURCE NOTES
- [NN/g Microinteractions in User Experience](https://www.nngroup.com/articles/microinteractions/) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `INT-001` — retrieve when the feature crosses into this topic.
- `INT-005` — retrieve when the feature crosses into this topic.
- `INT-007` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
