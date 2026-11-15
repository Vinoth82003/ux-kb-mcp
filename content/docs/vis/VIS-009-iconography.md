---
id: VIS-009
title: "Iconography"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [iconography, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-003, A11Y-006, CMP-001, DS-002]
sources:
  - name: "Nielsen Norman Group Icon Usability"
    url: "https://www.nngroup.com/articles/icon-usability/"
  - name: "W3C WCAG 2.2 Non-text Content"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html"
  - name: "Material Design 3 Icons"
    url: "https://m3.material.io/styles/icons/overview"
updated: 2026-11-15
---

# VIS-009 — Iconography

## Summary
Icons are a compact visual language; ambiguity and missing accessible names cause failures.

## MUST
- VIS-009.M1: Use one coherent icon family with consistent size, stroke and corner radius.
- VIS-009.M2: Provide an accessible name (aria-label/aria-labelledby or visually hidden text) for every icon-only control.
- VIS-009.M3: Use icons at standard sizes (16, 20, 24px) and align to text baseline; keep touch targets >=44x44px (see RSP-005).

## SHOULD
- VIS-009.S1: Pair unfamiliar or high-impact actions with visible text.
- VIS-009.S2: Use filled variants for selected/active states and outline for default when the family supports it.
- VIS-009.S3: Test icon meaning with target users for non-universal metaphors.

## AVOID
- VIS-009.A1: Emoji as product icons or obscure, invented metaphors.
- VIS-009.A2: Icon-only controls for destructive or irreversible actions.
- VIS-009.A3: Mixing multiple icon families or stroke weights.

## DECIDE
| Situation | Decision |
|---|---|
| Common action | Icon + label on first use; icon-only after learning |
| Destructive action | Always text label, never icon-only |
| Dense toolbar | 20/24px icons, 44px targets, tooltips |
| Status | Icon + color + text redundancy |

## STATES
- Default
- Hover/focus
- Selected/active
- Disabled
- Loading

## EXAMPLE
Good: "'Archive project' with archive icon + text, or icon-only with aria-label 'Archive project'." Bad: "Unlabeled box icon with no tooltip or accessible name."

## FAILURE MODES
- Ambiguous icons cause misinterpretation and errors.
- Missing accessible names block screen reader users.
- Mixed families reduce perceived quality and consistency.
- Small touch targets cause mis-taps on mobile.

## CHECK
- [ ] Meaning unambiguous?
- [ ] Family consistent?
- [ ] Accessible name present?
- [ ] Touch target sufficient?

## SOURCE NOTES
- [Nielsen Norman Group Icon Usability](https://www.nngroup.com/articles/icon-usability/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) — authoritative reference; this document paraphrases relevant guidance.
- [Material Design 3 Icons](https://m3.material.io/styles/icons/overview) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-003` — retrieve when the feature crosses into this topic.
- `A11Y-006` — retrieve when the feature crosses into this topic.
- `CMP-001` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.