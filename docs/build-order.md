# Build Order

| Phase | Deliverable | Exit evidence | Status |
|---|---|---|---|
| 1 | Monorepo, core schemas/linter/retrieval, initial 10 docs, core and anti-slop | Seed and unit tests | Done — 73 docs, `pnpm lint:kb`, 15 unit tests, `prisma/seed.ts` |
| 2 | MCP `get_doc`, `get_stage_pack`, `search_kb` | Agent connection test | Done — stdio + stateless HTTP, `pnpm smoke` |
| 3 | Sessions, logs, citation verification, keys, rate limits | Auth/session tests | Done — 7 tools, `pnpm test` (23), `pnpm smoke`, `pnpm smoke:http` |
| 4 | Admin docs, packs, releases | Draft/review/publish lifecycle | Not started |
| 5 | Usage, compliance and gaps | Observability verified | Not started |
| 6 | Agent files, critic, evals, Playwright/axe | Reproducible run | Not started |
| 7 | CI regression and content expansion from ranked gaps | Release gate | Not started |

Phase 1–3 run against the Markdown content layer. `prisma/schema.prisma` and
`prisma/seed.ts` hold the persisted auth/usage/gap tables; set `KB_STORE=db`
(or `DATABASE_URL`) to use `PrismaStore` instead of the in-memory store. The
MCP tool surface is unchanged between stores. See `docs/setup.md`.
