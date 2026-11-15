---
id: A11Y-008
title: "Inclusive Design"
domain: accessibility
group: M06
type: principle
status: reviewed
rev: 2
priority: core
stages: [audit, proposal, critique, implement]
tags: [inclusive-design, accessibility]
applies_to: [web, mobile]
related: [UX-001, UX-002, CW-002]
sources:
  - name: "Microsoft Inclusive Design"
    url: "https://inclusive.microsoft.design/"
  - name: "W3C WAI Fundamentals"
    url: "https://www.w3.org/WAI/fundamentals/"
updated: 2026-11-15
---

# A11Y-008 — Inclusive Design

## Summary
Inclusive design identifies exclusion across ability, language, culture, device and context, then builds flexible paths.

## MUST
- A11Y-008.M1: Define the supported user and context range and test edge cases affecting task success.
- A11Y-008.M2: Provide equivalent paths for users with different abilities, devices, languages or contexts.
- A11Y-008.M3: Justify any assumption about user identity, input format or environment.
- A11Y-008.M4: Include people with disabilities in research and testing where feasible.

## SHOULD
- A11Y-008.S1: Accept flexible input formats where data integrity permits.
- A11Y-008.S2: Support localization and adaptable layouts.

## AVOID
- A11Y-008.A1: Do not infer identity or intent from names, appearance or demographics.
- A11Y-008.A2: Do not ship single-path designs that exclude edge cases.

## DECIDE
| Situation | Decision |
|---|---|
| Narrow user assumption | Broaden range or document exclusion |
| Strict input format | Normalize and accept variants |
| Edge case rare | Test if task-critical |
| Localization | Plan content and layout flexibility |

## STATES
- Baseline user
- Constrained context
- Alternate input
- Localized
- Edge case
- Recovery

## EXAMPLE
Good: "Accept phone numbers with country code and normalize punctuation." Bad: "Reject names containing hyphens."

## FAILURE MODES
- Excluding edge cases hides task failures.
- Assumptions about devices or contexts reduce reach.
- Inflexible inputs cause abandonment.

## CHECK
- [ ] Exclusion risks recorded?
- [ ] Input assumptions justified?
- [ ] Equivalent paths exist?
- [ ] Edge cases tested?

## SOURCE NOTES
- [Microsoft Inclusive Design](https://inclusive.microsoft.design/) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WAI Fundamentals](https://www.w3.org/WAI/fundamentals/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `UX-001` — retrieve when the feature crosses into this topic.
- `UX-002` — retrieve when the feature crosses into this topic.
- `CW-002` — retrieve when the feature crosses into this topic.
