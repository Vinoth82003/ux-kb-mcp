# Running the stack (Phase 1–3)

Status: monorepo, core services, MCP server (stdio + stateless HTTP), sessions,
citation verification, API keys and rate limits. The admin UI and release
publishing lifecycle are Phase 4+ (see `docs/build-order.md`).

## Prerequisites

- Node.js >= 20 (tested on 24)
- pnpm 10 (`corepack enable` then `corepack prepare pnpm@10.18.0 --activate`)
- Postgres 15+ only for persisted API keys, usage logs and gaps

## Install and verify

```bash
cd ux-kb
pnpm install
pnpm lint:kb      # structure, IDs, links, token budgets
pnpm kb:info      # catalog stats and per-pack token estimates
pnpm typecheck
pnpm test         # 23 core unit tests
pnpm smoke        # end-to-end MCP stdio test (7 tools + 3 resources)
pnpm smoke:http   # HTTP auth, revocation, pinning, tool call, 429 handling
```

`pnpm lint:kb` exits non-zero on errors. Use `pnpm lint:kb:strict` to also fail
on warnings. `--json` prints a machine-readable report; `--content <dir>`
points at another content tree.

## Run the MCP server

### stdio (local agent)

```bash
pnpm dev:mcp
```

The stdio transport needs no API key: it auto-provisions an internal
`stdio-local` key in the configured store so sessions and usage rows still
have an owner.

Register it with Claude Code:

```bash
claude mcp add ux-kb -- node --import tsx \
  /absolute/path/to/ux-kb/apps/mcp-server/src/index.ts
```

Or with the built server (run `pnpm build` first):

```bash
claude mcp add ux-kb -- node /absolute/path/to/ux-kb/apps/mcp-server/dist/index.js
```

Cursor / Claude Desktop JSON equivalent:

```json
{
  "mcpServers": {
    "ux-kb": {
      "command": "node",
      "args": ["--import", "tsx", "/absolute/path/to/ux-kb/apps/mcp-server/src/index.ts"]
    }
  }
}
```

### Streamable HTTP

Every `/mcp` request must carry an API key:

```bash
MCP_DEV_KEY=dev-local-key pnpm dev:mcp:http   # http://127.0.0.1:3333/mcp
```

`MCP_DEV_KEY` is a local-development bootstrap: on startup the server hashes it
and creates an `http-dev` key if that hash is not already stored. Use
`MCP_DEV_KEY_RATE_LIMIT` to set its per-minute limit (default 120).

```bash
curl http://127.0.0.1:3333/healthz
curl -H "Authorization: Bearer dev-local-key" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  http://127.0.0.1:3333/mcp
```

Client registration:

```bash
claude mcp add --transport http ux-kb http://127.0.0.1:3333/mcp \
  --header "Authorization: Bearer dev-local-key"
```

Stateless HTTP: no session id and no SSE stream. Auth order is key lookup →
revocation check → pinned-version check → rate limit → tool execution. A key
pinned to a release this deployment does not serve is rejected with `409`
instead of silently receiving a different release. Limits are enforced per key
in a sliding one-minute window; over-limit responses return `429` with
`Retry-After`.

Environment (see `.env.example`): `MCP_TRANSPORT`, `MCP_PORT`, `MCP_HOST`,
`ADMIN_ORIGIN`, `UX_KB_CONTENT_DIR`, `KB_STORE`, `DATABASE_URL`,
`KEY_HASH_SECRET`, `MCP_DEV_KEY`, `MCP_DEV_KEY_RATE_LIMIT`.

## Tools and resources

| Surface | Purpose |
|---|---|
| `start_session { feature }` | Creates a session; returns `sessionId`, KB version, suggested doc IDs |
| `get_stage_pack { sessionId, stage }` | Core rules + stage docs + feature-routed docs |
| `get_doc { sessionId, id }` | Full document by ID |
| `search_kb { query, domain?, limit? }` | Ranked ID/title/summary hits |
| `get_checklist { ids }` | CHECK items only |
| `verify_citations { sessionId, citedIds }` | Unfetched, unknown and deprecated IDs |
| `report_gap { topic, context }` | Upserts a missing-topic report |
| `kb://doc/{id}` | Resource view of a document |
| `kb://pack/{stage}` | Resource view of a pack |
| `kb://core` | `core.md` + `anti-slop.md` |

Stages: `need_check`, `research`, `audit`, `proposal`, `critique`, `implement`.

Session flow:

1. `start_session` once per task. The returned `sessionId` is required by
   `get_stage_pack`, `get_doc` and `verify_citations`.
2. `get_stage_pack` before each stage; `get_doc` for extra topics.
3. `verify_citations` before submitting. It compares cited IDs against the
   session's fetch history and reports `unfetched`, `unknown` and `deprecated`
   separately. It proves retrieval, not that a source semantically supports the
   claim.
4. `report_gap` when the KB lacks a topic instead of inventing a rule.

Sessions are owned by the API key that created them; another key receives
`SESSION_FORBIDDEN`. `get_stage_pack` reports an estimated token count and
marks over-budget packs; the estimate is characters/4, not a model-specific
tokenizer count.

## API keys

Real keys are stored as HMAC-SHA256 hashes and must persist across processes,
so key administration requires `DATABASE_URL`:

```bash
pnpm kb:keys create --name laptop [--rate-limit 120] [--pin 1.0.0-rc.1]
pnpm kb:keys list
pnpm kb:keys revoke <id>
pnpm kb:keys gaps [--all]
```

The plaintext key is printed once at creation. `--pin` freezes a key to the
named release; the key only works against a deployment serving that release.
`pnpm kb:keys gaps` lists reported knowledge gaps, most-reported first.

For local stdio no key is needed. For local HTTP, either use `MCP_DEV_KEY` or
create a real key against Postgres. Set `KEY_HASH_SECRET` before creating keys;
it is required when `NODE_ENV=production`, and changing it invalidates every
existing key hash.

## Database

Content is still read from Markdown; Postgres stores keys, sessions, usage,
compliance reports and gaps. To create the schema and import content:

```bash
cp .env.example .env        # set DATABASE_URL and KEY_HASH_SECRET
pnpm db:generate
pnpm db:push
pnpm db:seed
```

`KB_STORE=db` (or a non-empty `DATABASE_URL`) selects `PrismaStore`;
`KB_STORE=memory` forces the in-memory store used by tests and `smoke:http`.
The seed is idempotent: docs are upserted and a `DocVersion` row is added only
when the body hash changes. `content/release.json` still stands in for the
`Release` row.

## Layout

```
ux-kb/
  content/                 Markdown knowledge base (published source of truth)
  prisma/schema.prisma     DB schema (docs, versions, releases, keys, usage, gaps)
  prisma/seed.ts           content/ -> Postgres
  packages/core/src/
    schemas/               zod front matter, packs, routes, releases
    content/               path resolution, parser, repository, token estimate
    services/              docs, packs + routing, search, release, auth,
                           rate limit, sessions/citations, gaps
    store/                 KbStore boundary: memory + Prisma implementations
    lint/                  doc + catalog linter
    cli/                   lint, info and key/gap commands
  apps/mcp-server/src/     MCP server (stdio + stateless HTTP)
  apps/mcp-server/scripts/ smoke.ts (stdio), http-smoke.ts (auth/429)
```

## Known limits

- Search is deterministic keyword scoring; no embeddings until the KB passes
  ~300 docs.
- The MCP server trusts reviewed Markdown. A bad doc becomes an instruction the
  agent follows, so review is the security boundary.
- Rate limiting is in-process. Multiple server instances need a shared limiter
  (Redis or Postgres) before horizontal scaling.
- Usage logs store tool arguments; avoid sending secrets in `feature`,
  `context` or query text.
- Citation verification proves fetch history, not semantic support for a claim.
- Token estimates are approximate (±15% for prose) and pack budgets are advisory.
