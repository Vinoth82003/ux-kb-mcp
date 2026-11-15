---
id: VIS-001
title: "Visual Hierarchy"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 2
priority: core
stages: [proposal, critique, implement]
tags: [visual-hierarchy, visual-design]
applies_to: [web, mobile]
related: [VIS-002, VIS-004, VIS-007, DS-002]
sources:
  - name: "Nielsen Norman Group Visual Hierarchy"
    url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/"
  - name: "W3C WCAG 2.2 Meaningful Sequence"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html"
  - name: "Material Design 3 Typography"
    url: "https://m3.material.io/styles/typography/overview"
updated: 2026-11-15
---

# VIS-001 — Visual Hierarchy

## Summary
Hierarchy makes the next useful action and relationships among content levels perceptible through combined cues.

## MUST
- VIS-001.M1: Combine at least two cues (size, weight, color, position, whitespace) for each level; do not rely on size alone.
- VIS-001.M2: Provide one dominant page heading and one primary action per view; subordinate supporting content.

## SHOULD
- VIS-001.S1: Make the primary task identifiable within a quick scan of the screen.
- VIS-001.S2: Use a documented type/weight/space scale so levels stay consistent across screens.

## AVOID
- VIS-001.A1: If two elements compete, reduce one or restructure the task.
- VIS-001.A2: Do not encode hierarchy through color alone (see VIS-003, A11Y-002).

## DECIDE
| Situation | Decision |
|---|---|
| Primary action | Largest/boldest in its region, isolated by whitespace |
| Dense content | Optimize scanning order before decoration |
| Responsive reflow | Preserve level order; stack, do not flatten |
| Competing elements | Reduce one or split the task |

## STATES
- Default
- Hover/focus
- Loading
- Empty
- Responsive
- Long content

## EXAMPLE
Good: "Dashboard: KPI value 32px/bold, label 14px, comparison 12px muted, note 12px." Bad: "All dashboard text 16px with only color differences."

## FAILURE MODES
- Equal visual weight causes users to miss the primary action.
- Color-only hierarchy fails for color-blind and low-vision users.
- Responsive reflow can flatten levels and hide priority.
- Decorative elements compete with task content.

## CHECK
- [ ] Primary task apparent quickly?
- [ ] Heading order semantic?
- [ ] Secondary actions subordinate?
- [ ] At least two cues per level?

## SOURCE NOTES
- [Nielsen Norman Group Visual Hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design 3 Typography](https://m3.material.io/styles/typography/overview) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-002` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `VIS-007` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.