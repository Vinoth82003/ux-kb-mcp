# UX-KB Website Redesign — Baseline Audit

**Date:** 2026-11-13
**Scope:** Phase 0 (audit only). No application code changes in this phase.
**Source of truth:** Repository working tree at `D:\TypeScript\ux-kb-mcp\ux-kb`, deployed site `https://ux-kb-site.vercel.app`, and `docs/redesign-spec.md`.
**Note on current tree:** The working tree contains uncommitted redesign changes from a prior pass (git HEAD `b3ff7b8`). This audit documents the *current* working-tree state as the baseline. The pre-change baseline is git HEAD; diff stats: 7 files changed, 699 insertions(+), 255 deletions(-).

---

## 1. Repository and route map

- **Package manager:** pnpm 10 (workspace). **Node:** ≥20. **TypeScript:** 5.9.
- **Monorepo layout:**
  - `packages/core` — services, content repository, store, lint, CLI.
  - `packages/mcp` — MCP server factory, tools, resources.
  - `apps/stdio` — stdio transport + scripts (`smoke.ts`, `http-smoke.ts`).
  - `apps/web` — Next.js 16.4.6 App Router site + `/api/mcp` + dashboard.
- **Framework (web):** Next.js 16.4.6 (webpack), React 19.0.0. No Tailwind (not in `apps/web/package.json`). Styling is plain CSS with semantic variables.
- **Routes (from production build):**
  - Public: `/`, `/_not-found`
  - API: `/api/auth/[...nextauth]`, `/api/cron/cleanup`, `/api/healthz`, `/api/mcp`
  - Authenticated: `/dashboard`, `/dashboard/gaps`, `/dashboard/keys`, `/dashboard/releases`, `/dashboard/usage`, `/dashboard/users`
  - Auth: `/signin`
- **Landing sections (in order):** Header/Nav, Hero (`#top`), Problem, How it works (`#how`), What's inside, Tool reference (`#tools`), Connect an agent (`#connect`), Why it's different, Architecture, Testing (`#testing`), FAQ, Footer. Supporting route `/signin`.
- **MCP:** 7 tools (`start_session`, `get_stage_pack`, `get_doc`, `search_kb`, `get_checklist`, `verify_citations`, `report_gap`), 3 resources (`kb://doc/{id}`, `kb://pack/{stage}`, `kb://core`). 6 stage packs, 10 feature routes, 73 topic docs, release `1.0.0-rc.1`.

## 2. Existing design/theme audit

- **Styling approach:** Plain CSS (`app/globals.css`) with CSS custom properties. No component library, no Tailwind.
- **Theme system:** `light`/`dark`/`system` via `data-theme` attribute on `<html>`, persisted in `localStorage` key `theme-mode`, with a no-FOUC init script in `layout.tsx`. System preference respected via `matchMedia`.
- **Tokens:** Full semantic token set present (light + dark) per the media kit: `--bg-primary`, `--bg-surface`, `--text-primary`, `--action-primary`, `--border-default`, `--radius-*`, `--shadow-*`, `--space-*`, etc. Backward-compat aliases (`--bg`, `--surface`, `--muted`, `--border`, `--text`, `--accent`, `--radius`, `--max`, …) retained for dashboard/signin inline styles.
- **Typography:** Inter (body, `--font-sans`), Space Grotesk (headings, `--font-heading`), JetBrains Mono (code, `--font-mono`), loaded via `next/font/google`.
- **Breakpoints (current):** 960px, 600px, 420px. Header collapses nav at 600px (`.nav-cta { display:none }`); no mobile drawer/menu exists — secondary nav links wrap and the Sign in/GitHub CTAs hide on small screens.
- **Motion:** CSS keyframes (`fadeInUp`) for hero/content entrance; hover lifts on cards; brand-mark scale/rotate; body theme transition. Reduced-motion baseline present (`prefers-reduced-motion: reduce` zeroes animation/transition durations). No animation library. No IntersectionObserver usage (entrances are CSS-only, not scroll-triggered).
- **Image/SVG loading:** `<img>` with explicit `width`/`height` for mascot; inline SVG for UI icons. `loading` priority not set; no `loading="lazy"` on below-fold mascots.
- **Accessibility (current):** Skip link, semantic landmarks, `aria-label`/`aria-hidden` on decorative mascot, focus-visible outline, tab/accordion semantics. No axe/automated a11y tooling in repo. Color contrast: orange `#F97316` on white fails AA for normal text (per media kit, 2.80:1) — mitigated by using burnt orange `#C2410C` for links and navy text on orange buttons.
- **SEO:** Title + description + OG metadata in `layout.tsx`/`page.tsx`. `public/robots.txt` allows all and references `https://ux-kb-site.vercel.app/sitemap.xml`, but no `sitemap.xml` exists (404). No structured data. `metadataBase` set.

## 3. Mascot asset inventory

Source directory (spec): `.agents/docs/mascot/`. All 12 expected files present.

| File | Exists | Renders | True vector | viewBox | Size | Groups | IDs | Notes |
|---|---|---|---|---|---|---|---|---|
| pose-01-brand-mark.svg | yes | yes | yes | 0 0 768 768 | 3.4 KB | 3 | 5 (gradient defs) | Clean geometric cat; editable-ish groups (no IDs on groups) |
| pose-02-confident-expert.svg | yes | (not visually rendered here) | yes (paths only, no raster) | 0 0 1312 1199 | 221 KB | 0 | 0 | Auto-traced, extremely complex (414 paths); no groups/IDs → no internal animation possible |
| pose-03-observer.svg | yes | not rendered | yes | 0 0 1312 1199 | 172 KB | 0 | 0 | Same as above |
| pose-04-instructor.svg | yes | not rendered | yes | 0 0 1312 1199 | 200 KB | 0 | 0 | Same |
| pose-05-knowledge-keeper.svg | yes | not rendered | yes | 0 0 1312 1199 | 205 KB | 0 | 0 | Same |
| pose-06-technical-specialist.svg | yes | not rendered | yes | 0 0 1312 1199 | 172 KB | 0 | 0 | Same |
| pose-07-integration-assistant.svg | yes | not rendered | yes | 0 0 1312 1199 | 210 KB | 0 | 0 | Same |
| pose-08-guardian.svg | yes | not rendered | yes | 0 0 1312 1199 | 184 KB | 0 | 0 | Same |
| pose-09-engineer.svg | yes | not rendered | yes | 0 0 1312 1199 | 222 KB | 0 | 0 | Same |
| pose-10-quality-inspector.svg | yes | not rendered | yes | 0 0 1312 1199 | 193 KB | 0 | 0 | Same |
| pose-11-helpful-companion.svg | yes | not rendered | yes | 0 0 1312 1199 | 202 KB | 0 | 0 | Same |
| pose-12-friendly-companion.svg | yes | not rendered | yes | 0 0 1312 1199 | 209 KB | 0 | 0 | Same |

**Defects/gaps identified (per spec, do not silently repair):**
- Only `pose-01-brand-mark.svg` is a clean, small vector suitable as a brand mark. Poses 02–12 are auto-traced, flat path dumps (~170–222 KB each, 1312×1199) with **no groups or IDs**, so internal SVG animation (pointing arm, head tilt, paw, etc.) is not possible. Only whole-image transforms are safe.
- Assets are large (~2 MB total if all loaded) and below-fold; eager loading would hurt LCP/transfer size. Lazy-loading required.
- Aspect ratios differ (pose-01 is 1:1; poses 02–12 are ~1.09:1). Do not force identical boxes.
- No dark-theme-specific variants; navy artwork may disappear on dark surfaces — must place on ivory/neutral illustration surface or use approved variant (none supplied).
- **Not copied to `apps/web/public/mascot/` yet** — only `pose-01` is in use (as `/ux-kb-cat-mascot.svg`, copied from the favicon set). Poses 02–12 are not deployed.
- Visual render verification of poses 02–12 was not performed in this environment (no screenshot viewing capability). Recommend manual visual QA before use.

## 4. Real metrics and sources

Product proof metrics (validated against deployed `/api/healthz` and repository):

| Claim | Website value | Source-of-truth value | Source | Timestamp | Action |
|---|---|---|---|---|---|
| KB version | 1.0.0-rc.1 | 1.0.0-rc.1 | `content/release.json`, `/api/healthz` | 2026-11-13 | keep |
| Topic docs | 73 | 73 | `/api/healthz` (`docs:73`), `content/` | 2026-11-13 | keep |
| Stage packs | 6 | 6 | `content/packs/` (6 files) | 2026-11-13 | keep |
| Feature routes | 10 | 10 | `content/routing/feature-routes.md` | 2026-11-13 | keep |
| MCP tools | 7 | 7 | `packages/mcp/src` (`server.tool` ×7) | 2026-11-13 | keep |
| MCP resources | 3 | 3 | `kb://doc/{id}`, `kb://pack/{stage}`, `kb://core` | 2026-11-13 | keep |
| Unit tests | 35 | 35 | `pnpm test` (35 pass, 0 fail) | 2026-11-13 | keep |
| License | MIT | MIT | `LICENSE` | 2026-11-13 | keep |

**Analytics/traffic:** No analytics provider configured anywhere in `apps/web` (no Vercel Analytics, GA4, Plausible, PostHog, etc.; no tracking scripts in layout; no analytics env vars). **NOT AVAILABLE** — no traffic, conversion, device, or geography data exists. Do not fabricate.

**Performance:** No field (RUM) or lab (Lighthouse) measurements recorded. **NOT AVAILABLE.** Core Web Vitals targets (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1) are reference only, not measured.

**Admin/dashboard data:** Postgres-backed (`KB_STORE=db`); keys/usage/gaps exist in schema, but no production usage export was inspected. **NOT AVAILABLE** in this audit.

## 5. Conversion funnel (if instrumented)

No conversion instrumentation exists. CTAs present: GitHub (header + hero), Connect (hero + tabs), Sign in (header), copy-to-clipboard (connect panels). No events are emitted for any of them. Funnel is **uninstrumented**. Recommended events per spec §2.6 are not yet implemented.

## 6. Device distribution and responsive issues

- **Device distribution:** NOT AVAILABLE (no analytics).
- **Current responsive behavior:** breakpoints at 960/600/420px; single-column stacking at 600px; tool table horizontal scroll not explicitly handled (relies on container); no mobile navigation drawer — secondary nav wraps and CTAs hide at ≤600px.
- **Known issues:**
  - No mobile menu/drawer; Sign in and GitHub CTAs disappear on small screens (`.nav-cta { display:none }` at ≤600px) with no alternative entry.
  - Hero stats grid: 4 cols → 2 cols at 600px; okay.
  - Tool table: no explicit overflow container; risk of horizontal page scroll on narrow viewports.
  - No `loading="lazy"` on below-fold mascot/img.
  - Sticky header anchor offsets not explicitly handled for `#how`, `#tools`, `#connect`, `#testing`.
  - Mascot (768×768 SVG) in header at 32px — fine; but poses 02–12 are 1312×1199 and heavy.

## 7. Performance baseline

**NOT MEASURED.** No Lighthouse/WebPageTest/Speed Insights data captured. Qualitative notes:
- Landing is statically prerendered (build shows `○ /`).
- Fonts loaded via `next/font/google` (self-hosted, swap) — good.
- Risk: 12 mascot SVGs at ~200 KB each (~2 MB) if all used eagerly; currently only pose-01 brand mark is used (~3.5 KB).
- No image optimization pipeline for SVGs (served as-is).

## 8. Accessibility and SEO baseline

- **Accessibility:** WCAG 2.2 AA target stated in media kit. Manual/automated scan not run (no axe in repo). Known: color contrast for orange on white fails for normal text (mitigated by burnt orange for links); focus indicators present; reduced-motion baseline present; keyboard operability of tabs/copy not verified manually.
- **SEO:** Title/description/OG set. `robots.txt` references a non-existent `sitemap.xml` (404). No canonical tag explicitly set (Next defaults). No structured data. Heading hierarchy: single H1 in hero, H2 per section — good.

## 9. Existing test/build baseline

- `pnpm lint:kb:strict`: 0 errors, 0 warnings (73 docs).
- `pnpm typecheck`: passes (core, mcp, stdio, web).
- `pnpm test`: 35/35 pass (core unit tests).
- `pnpm --filter @ux-kb/web build`: passes; routes listed above; `/` statically generated.
- `pnpm smoke` / `pnpm smoke:http`: not run in this audit (require DB/dev server). Commands exist in `apps/stdio/scripts/`.
- No web E2E tests (Playwright is configured as an MCP tool, not a test runner in this repo).

## 10. Data gaps and instrumentation limitations

- No analytics of any kind → no traffic, device, geography, conversion, or retention data. Marked NOT AVAILABLE, not estimated.
- No performance measurements recorded.
- No accessibility audit tooling in repo.
- Mascot poses 02–12 not visually verified in this environment (no image viewing); manual QA required before use.
- Dashboard production usage not inspected (no DB export in this audit).
- `sitemap.xml` referenced but absent.

## 11. Prioritized recommendations (evidence-supported)

1. **P1 — Mobile navigation:** Add an accessible menu/drawer so Sign in/GitHub and section links remain reachable below 600px (spec §5.2/§6.1). Currently CTAs vanish.
2. **P1 — Tool table overflow:** Wrap table in a scroll container with visible affordance (spec §6.6).
3. **P1 — Lazy-load mascots:** Add `loading="lazy"` and intrinsic dimensions to below-fold mascot images; prioritize hero asset (spec §10.2).
4. **P1 — Fix sitemap:** Either generate `sitemap.xml` or remove the reference in `robots.txt` (spec §10.3).
5. **P2 — Mascot deployment:** Copy poses 02–12 to `apps/web/public/mascot/` only after visual QA; use whole-image transforms only (no internal animation) since groups/IDs are absent.
6. **P2 — Dark-theme mascot surface:** Place navy mascot artwork on ivory/neutral illustration surface in dark theme; no global filters.
7. **P2 — Instrumentation (with consent review):** Implement only the spec §2.6 events needed for the actual funnel (hero GitHub/connect clicks, connect tab select, config copy success/error, faq expand) — after privacy/consent review; none exist today.
8. **P3 — Performance measurement:** Capture Lighthouse + (if available) Vercel Speed Insights before/after any further change; do not claim improvement without data.
9. **P3 — Accessibility audit:** Run keyboard-only + screen-reader pass; add axe if approved; document limitations.
10. **P3 — Anchor offsets:** Add `scroll-margin-top` for sticky header on section anchors.

**Phase 0 gate:** Audit complete. No code changes made in this phase. Ready for Phase 1 (asset preparation) pending approval of the asset defects above.