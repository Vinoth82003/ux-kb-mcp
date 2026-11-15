---
id: VIS-002
title: "Typography"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 2
priority: core
stages: [proposal, critique, implement]
tags: [typography, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-004, DS-002, A11Y-002]
sources:
  - name: "MDN Styling Text"
    url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text"
  - name: "W3C WCAG 2.2 Resize Text"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html"
  - name: "W3C WCAG 2.2 Text Spacing"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html"
  - name: "Nielsen Norman Group Line Length"
    url: "https://www.nngroup.com/articles/line-length-readability/"
updated: 2026-11-15
---

# VIS-002 — Typography

## Summary
Typography is a system for reading, navigation and emphasis with measurable legibility.

## MUST
- VIS-002.M1: Define semantic styles for page title, section, body, label, helper and metadata.
- VIS-002.M2: Use relative units (rem/em) for font sizes and spacing; support 200% browser zoom without loss of content or function (WCAG 1.4.4).
- VIS-002.M3: Keep body line length between 45 and 75 characters (aim ~65) and body line-height between 1.4 and 1.6.

## SHOULD
- VIS-002.S1: Use a type scale with at least 4 distinct sizes (e.g., 0.875, 1, 1.25, 1.5, 2, 2.5, 3 rem on a 16px base) and weights 400/500/600/700.
- VIS-002.S2: Meet WCAG 1.4.12 text spacing: line-height 1.5, paragraph spacing 2x font size, letter spacing 0.12em, word spacing 0.16em without clipping.
- VIS-002.S3: Test long strings, localization and 200% zoom.

## AVOID
- VIS-002.A1: Thin weights (<400) for small text (<18px) and all-caps as the only distinction.
- VIS-002.A2: Fixed px font sizes for body copy or line-height below 1.3 for paragraphs.
- VIS-002.A3: Center-aligned long body copy (>3 lines) or justified text without hyphenation.

## DECIDE
| Situation | Decision |
|---|---|
| Body copy | 1rem (16px) minimum, 1.4-1.6 line-height, 45-75ch |
| Headings | 1.1-1.3 line-height, weight 600-700, shorter measure |
| Dense UI | 0.875rem labels, tabular nums, 1.3 line-height |
| Localization | Allow 30-50% expansion; test wrapping |

## STATES
- Default
- Hover/focus
- Truncated/overflow
- Zoom 200%
- Localized
- Dark mode

## EXAMPLE
Good: "Body 1rem/1.5, measure 65ch, headings 1.25-2rem weight 600." Bad: "14px gray body text with 1.1 line-height in a 120ch column."

## FAILURE MODES
- Fixed small type fails zoom and low-vision users.
- Long measure reduces reading speed and comprehension.
- Tight line-height causes line collisions at large sizes.
- All-caps or thin weights reduce legibility.

## CHECK
- [ ] Type roles map to hierarchy?
- [ ] 200% zoom works?
- [ ] Line length 45-75ch?
- [ ] Line-height >=1.4 body?
- [ ] Text spacing (1.4.12) works?

## SOURCE NOTES
- [MDN Styling Text](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) — authoritative reference; this document paraphrases relevant guidance.
- [W3C WCAG 2.2 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) — authoritative reference; this document paraphrases relevant guidance.
- [Nielsen Norman Group Line Length](https://www.nngroup.com/articles/line-length-readability/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-004` — retrieve when the feature crosses into this topic.
- `DS-002` — retrieve when the feature crosses into this topic.
- `A11Y-002` — retrieve when the feature crosses into this topic.