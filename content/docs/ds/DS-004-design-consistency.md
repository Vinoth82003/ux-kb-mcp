---
id: DS-004
title: "Design Consistency"
domain: design_systems
group: M09
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [design-consistency, design-systems]
applies_to: [web, mobile]
related: [DS-001, DS-005, UX-005, EVAL-001]
sources:
  - name: "Nielsen Norman Group 10 Usability Heuristics"
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines/"
  - name: "IBM Carbon Design System"
    url: "https://carbondesignsystem.com/"
updated: 2026-11-15
---

# DS-004 — Design Consistency

## Summary
Consistency reduces relearning when same patterns mean and behave the same.

## MUST
- DS-004.M1: Use same label, treatment and interaction for same action unless justified.
- DS-004.M2: Audit divergent behavior across repeated flows, not only pixels.

## SHOULD
- DS-004.S1: Document approved exceptions with rationale and owner.

## AVOID
- DS-004.A1: Do not standardize a pattern proven wrong for a task.
- DS-004.A2: Do not enforce visual sameness that harms task performance.

## DECIDE
| Situation | Decision |
|---|---|
| Same action, different label | Align to one term |
| Justified exception | Document rationale and scope |
| Pattern proven wrong | Redesign before standardizing |
| Cross-platform difference | Keep interaction parity, allow platform conventions |

## STATES
- Aligned
- Exception recorded
- Divergent
- Under review

## EXAMPLE
Good: "Destructive actions share danger semantics and confirmation language across screens." Bad: "Delete is 'Remove' on one page and 'Trash' on another with different confirmations."

## FAILURE MODES
- Inconsistent labels force relearning and errors.
- Pixel-only audits miss behavioral divergence.
- Premature standardization locks in bad patterns.

## CHECK
- [ ] Same action same meaning?
- [ ] Exceptions justified and documented?
- [ ] Cross-screen and cross-platform checked?

## SOURCE NOTES
- [Nielsen Norman Group 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — authoritative reference; this document paraphrases relevant guidance.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — authoritative reference; this document paraphrases relevant guidance.
- [IBM Carbon Design System](https://carbondesignsystem.com/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `DS-001` — retrieve when the feature crosses into this topic.
- `DS-005` — retrieve when the feature crosses into this topic.
- `UX-005` — retrieve when the feature crosses into this topic.
- `EVAL-001` — retrieve when the feature crosses into this topic.