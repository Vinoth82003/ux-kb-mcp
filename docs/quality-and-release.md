# Quality Loop and Release Process

Pipeline: draft → lint → source review → reviewed → candidate → regression → staging key → publish → export Markdown → monitor.

Gates: file/ID match; all related IDs resolve; source list non-empty; no repeated boilerplate; packs/routes valid; proposal pack <=6,000 tokens; ten scenarios evaluated; no critical defect; score target >=85; human publisher approval; rollback target exists.

Objective checks: browser screenshots; keyboard-only journeys; axe or equivalent; contrast measurements; 200% zoom/reflow; screen-reader tests for critical tasks. Automated scans are not full WCAG conformance.

Keep scenario prompts stable. Record model/version, prompt, outputs, fetched IDs, scores, defects, latency and tokens. Do not publish on self-scoring alone.
