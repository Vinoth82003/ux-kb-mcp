---
id: SAAS-005
title: "Authentication UX"
domain: saas
group: M08
type: pattern
status: reviewed
rev: 2
priority: standard
stages: [research, proposal, critique, implement]
tags: [authentication-ux, saas]
applies_to: [web, mobile]
related: [CW-005, INT-006, A11Y-003, A11Y-004]
sources:
  - name: "W3C WCAG 2.2"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "NIST SP 800-63B Digital Identity Guidelines"
    url: "https://pages.nist.gov/800-63-3/sp800-63b.html"
  - name: "NN/g Form Design"
    url: "https://www.nngroup.com/articles/web-form-design/"
updated: 2026-11-15
---

# SAAS-005 — Authentication UX

## Summary
Authentication protects accounts while reducing avoidable failure and supporting recovery.

## MUST
- SAAS-005.M1: Allow password paste, managers and autofill; use correct autocomplete semantics.
- SAAS-005.M2: Support accessible authentication (WCAG 2.2 SC 3.3.8): do not require cognitive function tests unless an accessible alternative or mechanism is provided.

## SHOULD
- SAAS-005.S1: Explain errors without exposing account existence where enumeration risk matters.
- SAAS-005.S2: Follow NIST password guidance: minimum 8 characters, allow at least 64, permit all printable characters, screen against breached lists, avoid composition rules.

## AVOID
- SAAS-005.A1: Do not block paste, impose arbitrary composition rules or make CAPTCHA the only accessible path.

## DECIDE
| Situation | Decision |
|---|---|
| Password entry | Allow paste/manager/autofill |
| Error message | Generic to avoid enumeration |
| MFA unavailable | Provide accessible alternative |

## STATES
- Signed out
- Submitting
- Authenticated
- Locked
- Recovery
- Error

## EXAMPLE
Good: Password field allows paste and autocomplete="current-password". Bad: Paste disabled with composition rules.

## FAILURE MODES
- Blocking paste breaks password managers; allow paste/autofill.
- Account enumeration via errors; use generic messages.
- CAPTCHA-only path excludes users; provide alternative.

## CHECK
- [ ] Paste/autofill works?
- [ ] Recovery complete?
- [ ] Enumeration risk considered?
- [ ] MFA alternatives?

## SOURCE NOTES
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — authoritative reference; this document paraphrases relevant guidance.
- [NIST SP 800-63B Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html) — authoritative reference; this document paraphrases relevant guidance.
- [NN/g Form Design](https://www.nngroup.com/articles/web-form-design/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `CW-005` — retrieve when the feature crosses into this topic.
- `INT-006` — retrieve when the feature crosses into this topic.
- `A11Y-003` — retrieve when the feature crosses into this topic.
- `A11Y-004` — retrieve when the feature crosses into this topic.