---
id: CW-005
title: "Form Instructions"
domain: content_writing
group: M07
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [form-instructions, content-writing]
applies_to: [web, mobile]
related: [CW-001, CW-002, CMP-002, A11Y-007]
sources:
  - name: "NN/g Form Design"
    url: "https://www.nngroup.com/articles/web-form-design/"
  - name: "GOV.UK Text Input"
    url: "https://design-system.service.gov.uk/components/text-input/"
  - name: "W3C WCAG 2.2 Understanding Labels or Instructions"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html"
updated: 2026-11-15
---

# CW-005 — Form Instructions

## Summary
Form instructions explain required data, format, privacy and completion before submission.

## MUST
- CW-005.M1: State required/optional and non-obvious formats before entry.
- CW-005.M2: State what data is collected, why, and retention or sharing; link to the privacy policy before submission.

## SHOULD
- CW-005.S1: Use examples matching accepted formats, e.g. "DD/MM/YYYY".
- CW-005.S2: Place instructions adjacent to the field; keep global notes above the form.

## AVOID
- CW-005.A1: Do not put essential instructions in a distant paragraph.
- CW-005.A2: Do not hide privacy terms behind a generic "Terms" link.

## DECIDE
| Situation | Decision |
|---|---|
| Required/optional | Mark each field explicitly |
| Format | Show pattern plus a valid example |
| Privacy | State use, retention and policy link |
| Long guidance | Use progressive disclosure adjacent to the field |

## STATES
- Default
- Required/optional
- Format hint
- Validation
- Success
- Localized

## EXAMPLE
Good: "Date of birth (DD/MM/YYYY), e.g. 14/03/1990. We use this to verify age; see Privacy." Bad: "Enter DOB" with no format or privacy note.

## FAILURE MODES
- Hidden formats cause repeated validation errors.
- Privacy surprises reduce trust and completion.
- Distant instructions are missed at the point of entry.
- Placeholder-only format hints vanish while typing.

## CHECK
- [ ] Required status clear?
- [ ] Examples valid?
- [ ] Instructions adjacent?
- [ ] Privacy stated?

## SOURCE NOTES
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Text Input](https://design-system.service.gov.uk/components/text-input/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Understanding Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `CW-001` — retrieve when the feature crosses into this topic.
- `CW-002` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.
- `A11Y-007` — retrieve when the feature crosses into this topic.