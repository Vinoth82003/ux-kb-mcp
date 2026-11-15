---
id: VIS-010
title: "Imagery and Illustration"
domain: visual_design
group: M02
type: principle
status: reviewed
rev: 2
priority: standard
stages: [proposal, critique, implement]
tags: [imagery-and-illustration, visual-design]
applies_to: [web, mobile]
related: [VIS-001, VIS-003, A11Y-001]
sources:
  - name: "W3C WCAG 2.2 Non-text Content"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html"
  - name: "MDN Responsive Images"
    url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images"
  - name: "Nielsen Norman Group Images as Information"
    url: "https://www.nngroup.com/articles/images-as-information/"
updated: 2026-11-15
---

# VIS-010 — Imagery and Illustration

## Summary
Imagery should add task information, context or brand meaning; decorative images carry no information.

## MUST
- VIS-010.M1: Use representative imagery that matches the actual product/variant; provide equivalent alt text for informative images.
- VIS-010.M2: Use empty alt (alt="") for purely decorative images.
- VIS-010.M3: Serve responsive images (srcset/sizes) in modern formats (WebP/AVIF) with explicit dimensions to prevent layout shift.

## SHOULD
- VIS-010.S1: Lazy-load below-the-fold images; prioritize LCP image.
- VIS-010.S2: Preserve meaning when cropping; use object-fit and defined aspect ratios.
- VIS-010.S3: Provide captions or context for complex informative images.

## AVOID
- VIS-010.A1: Stock imagery as fake evidence or filler.
- VIS-010.A2: Images that misrepresent the product or obscure text.
- VIS-010.A3: Unbounded image sizes causing CLS or slow loads.

## DECIDE
| Situation | Decision |
|---|---|
| Product image | Show exact purchasable variant |
| Decorative | Empty alt; aria-hidden if needed |
| Hero image | Optimize for LCP; provide fallback |
| Illustration | Support task or brand, not filler |

## STATES
- Default
- Loading
- Error/missing
- Responsive
- Dark mode (if applicable)
- Reduced motion

## EXAMPLE
Good: "Product image shows exact color/size; alt describes variant." Bad: "Generic stock photo with 'Our team' caption."

## FAILURE MODES
- Misleading imagery erodes trust and causes returns.
- Missing or wrong alt text blocks screen reader users.
- Unoptimized images hurt performance and CLS.
- Decorative images announced as content create noise.

## CHECK
- [ ] Image supports task?
- [ ] Alt equivalent?
- [ ] Crop preserves meaning?
- [ ] Responsive and optimized?

## SOURCE NOTES
- [W3C WCAG 2.2 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) — authoritative reference; this document paraphrases relevant guidance.
- [MDN Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) — authoritative reference; this document paraphrases relevant guidance.
- [Nielsen Norman Group Images as Information](https://www.nngroup.com/articles/images-as-information/) — authoritative reference; this document paraphrases relevant guidance.

## RELATED DOCUMENTS
- `VIS-001` — retrieve when the feature crosses into this topic.
- `VIS-003` — retrieve when the feature crosses into this topic.
- `A11Y-001` — retrieve when the feature crosses into this topic.