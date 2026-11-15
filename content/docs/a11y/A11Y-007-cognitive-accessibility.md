---
id: A11Y-007
title: "Cognitive Accessibility"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [cognitive-accessibility, accessibility]
applies_to: [web, mobile]
related: [CW-001, CW-003, CW-005, EVAL-002]
sources:
  - name: "W3C Making Content Usable for People with Cognitive and Learning Disabilities"
    url: "https://www.w3.org/TR/coga-usable/"
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "Nielsen Norman Group Minimize Cognitive Load"
    url: "https://www.nngroup.com/articles/minimize-cognitive-load/"
updated: 2026-11-15
---

# A11Y-007 — Cognitive Accessibility

## Summary
Cognitive accessibility reduces memory, language, attention and decision burden while preserving control.

## MUST
- A11Y-007.M1: Keep instructions at point of need and preserve data through errors and interruption.
- A11Y-007.M2: SC 3.3.7: do not require re-entering information already provided.
- A11Y-007.M3: SC 3.3.8: avoid cognitive function tests for authentication unless an alternative is provided.
- A11Y-007.M4: Allow review and correction before final submission.

## SHOULD
- A11Y-007.S1: Break complex tasks into meaningful steps with progress and review.
- A11Y-007.S2: Use plain language and define abbreviations.

## AVOID
- A11Y-007.A1: Do not rely on unexplained abbreviations, time pressure or memory-only instructions.
- A11Y-007.A2: Do not use unadjustable time limits on critical tasks.

## DECIDE
| Situation | Decision |
|---|---|
| Multi-step task | Provide progress, save/resume and review |
| Authentication | Allow password managers or passkeys; avoid puzzles |
| Time limit | Allow extension or adjustment where required |
| Complex form | Preserve input and allow correction |

## STATES
- Entry
- In progress
- Interrupted
- Review
- Error
- Recovery

## EXAMPLE
Good: "Password requirements visible before entry; failed submission retains values." Bad: "Clear form on validation error."

## FAILURE MODES
- Validation clears user input.
- Memory-only instructions cause errors.
- Time limits block task completion.

## CHECK
- [ ] Instructions adjacent?
- [ ] Review/correction possible?
- [ ] Plain language?
- [ ] Time limits adjustable?
- [ ] Redundant entry avoided?

## SOURCE NOTES
- [W3C Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [Nielsen Norman Group Minimize Cognitive Load](https://www.nngroup.com/articles/minimize-cognitive-load/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `CW-001` — retrieve when the feature crosses into this topic.
- `CW-003` — retrieve when the feature crosses into this topic.
- `CW-005` — retrieve when the feature crosses into this topic.
- `EVAL-002` — retrieve when the feature crosses into this topic.
