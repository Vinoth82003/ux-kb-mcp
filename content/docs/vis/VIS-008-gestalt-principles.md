---
id: VIS-008
title: "Gestalt Principles"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [gestalt-principles, visual-design]
applies_to: [web, mobile]
related: [EVAL-005, VIS-001, VIS-004, DS-004]
sources:
  - name: "Nielsen Norman Group Proximity"
    url: "https://www.nngroup.com/articles/gestalt-proximity"
  - name: "Interaction Design Foundation Gestalt Principles"
    url: "https://www.interaction-design.org/literature/topics/gestalt-principles"
  - name: "MDN CSS Layout"
    url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout"
updated: 2026-11-15
---

# VIS-008 — Gestalt Principles

## Summary
Gestalt principles describe how people perceive grouping and relationships; VIS-008 owns the definitions, EVAL-005 applies them.

## MUST
- VIS-008.M1: Use proximity to group labels and controls; similarity for same-function elements.
- VIS-008.M2: Define and apply: proximity, similarity, continuity, closure, figure-ground, common region, common fate.
- VIS-008.M3: Use a boundary (card, divider, background) when proximity alone is ambiguous.

## SHOULD
- VIS-008.S1: Keep within-group gap clearly smaller than between-group gap (e.g., <=8px inside, >=24px between).
- VIS-008.S2: Style elements with the same behavior identically; differentiate distinct roles.
- VIS-008.S3: Verify perceived groups against semantic relationships and task flow.

## AVOID
- VIS-008.A1: Styling different behaviors identically.
- VIS-008.A2: Grouping unrelated controls because they share a card.
- VIS-008.A3: Relying on proximity when responsive reflow breaks it.

## DECIDE
| Situation | Decision |
|---|---|
| Ambiguous grouping | Add boundary or spacing (VIS-004) |
| Dense form | Group by task, not layout convenience |
| Responsive reflow | Preserve perceived relationships |
| Similar roles | Match styling exactly |

## STATES
- Default
- Dense content
- Responsive
- Interactive states
- Error states

## EXAMPLE
Good: "Field label, input and error form one perceived group; submit separate." Bad: "Card groups submit button with unrelated settings."

## FAILURE MODES
- Visual grouping can imply false hierarchy; verify with task scanning.
- Consistent styling across different behaviors causes misclicks.
- Responsive reflow can break grouping; re-check at narrow widths.
- Proximity without boundaries becomes ambiguous in dense layouts.

## CHECK
- [ ] Perceived groups match semantics?
- [ ] Similar styling means similar behavior?
- [ ] Reflow preserves grouping?
- [ ] Boundaries used when needed?

## SOURCE NOTES
- [Nielsen Norman Group Proximity](https://www.nngroup.com/articles/gestalt-proximity) — authoritative reference; this document paraphrases relevant guidance.
- [Interaction Design Foundation Gestalt Principles](https://www.interaction-design.org/literature/topics/gestalt-principles) — authoritative reference; this document paraphrases relevant guidance.
- [MDN CSS Layout](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `EVAL-005` — retrieve when the feature crosses into this topic.
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-004` — retrieve when the feature crosses into this topic.