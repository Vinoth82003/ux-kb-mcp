---
id: CW-001
title: "UX Writing"
domain: content_writing
group: M07
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [ux-writing, content-writing]
applies_to: [web, mobile]
related: [CW-002, CW-003, CW-004, CW-005, A11Y-007, CMP-002]
sources:
  - name: "NN/g How Users Read on the Web"
    url: "https://www.nngroup.com/articles/how-users-read-on-the-web/"
  - name: "GOV.UK Content Design"
    url: "https://www.gov.uk/guidance/content-design"
  - name: "Microsoft Writing Style Guide"
    url: "https://learn.microsoft.com/en-us/style-guide/welcome/"
updated: 2026-11-15
---

# CW-001 — UX Writing

## Summary
UX writing helps users understand tasks, decisions and recovery through concise, consistent language.

## MUST
- CW-001.M1: Name the user's task or outcome in the user's vocabulary; avoid internal system names.
- CW-001.M2: Use one canonical term per concept across labels, messages, docs and support.

## SHOULD
- CW-001.S1: Lead with the action or outcome; put qualifying detail after.
- CW-001.S2: Use sentence case and active voice; keep sentences under ~20 words.

## AVOID
- CW-001.A1: Avoid promotional filler, cleverness, jargon and unexplained abbreviations.
- CW-001.A2: Avoid ambiguous pronouns and generic link text such as "click here" or "learn more".

## DECIDE
| Situation | Decision |
|---|---|
| Task naming | Use verb + object, e.g. "Download invoice" |
| Repeated concept | Choose one canonical term and reuse it |
| Technical term | Define on first use in user language |
| Tone | Match the user's state, not brand voice |

## STATES
- Default
- Scanning
- Decision point
- Error/recovery
- Empty
- Localized

## EXAMPLE
Good: "Download invoice (PDF, 240 KB)". Bad: "Get it".

## FAILURE MODES
- Jargon passes review but blocks task completion.
- Inconsistent terms make search and help fail.
- Clever copy hides the action behind wordplay.
- Overlong copy breaks scanning and localization.

## CHECK
- [ ] Task named?
- [ ] Terminology consistent?
- [ ] Audience language appropriate?
- [ ] Links descriptive?

## SOURCE NOTES
- [NN/g How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/) — authoritative reference; this document paraphrases relevant guidance.
- [GOV.UK Content Design](https://www.gov.uk/guidance/content-design) — authoritative reference; this document paraphrases relevant guidance.
- [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `CW-002` — retrieve when the feature crosses into this topic.
- `CW-003` — retrieve when the feature crosses into this topic.
- `CW-004` — retrieve when the feature crosses into this topic.
- `CW-005` — retrieve when the feature crosses into this topic.
- `A11Y-007` — retrieve when the feature crosses into this topic.
- `CMP-002` — retrieve when the feature crosses into this topic.