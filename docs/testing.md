# Testing Guide

This guide verifies the UX-KB MCP server and the public site end to end. Every
command is runnable as-is on Windows (PowerShell) or any Unix shell unless noted.

## Prerequisites

- Node.js ≥ 20 (tested on 24)
- pnpm 10 (`corepack enable && corepack prepare pnpm@10.18.0 --activate`)
- A terminal in `ux-kb/`
- Optional: Postgres for the persisted store; `.env` configured (see setup)

## Install

```bash
pnpm install
```

## 1. Automated checks (no database needed)

```bash
pnpm lint:kb:strict   # 0 errors, 0 warnings across 73 docs
pnpm typecheck        # tsc in core and mcp-server
pnpm test             # 23 core unit tests
pnpm build            # tsup bundle for the MCP server
pnpm smoke            # stdio end-to-end: 7 tools + 3 resources
pnpm smoke:http       # HTTP: 401, initialize, start_session, 429, 409, revoked
```

Expected: all commands exit 0. `pnpm smoke` prints `All smoke checks passed.`

## 2. Manual stdio session (Claude Code)

Register the server:

```bash
claude mcp add ux-kb -- node --import tsx \
  /absolute/path/to/ux-kb/apps/mcp-server/src/index.ts
```

Then in Claude Code:

1. Ask it to design a pricing page.
2. Confirm it calls `start_session` first.
3. Confirm it calls `get_stage_pack` with `proposal`.
4. Confirm it fetches at least one doc via `get_doc`.
5. Ask it to cite the IDs it used; then ask it to run `verify_citations`.
6. Expected: `compliant: true` only if every cited ID was fetched.

## 3. Manual HTTP session

Start the server:

```bash
MCP_DEV_KEY=dev-local-key pnpm dev:mcp:http   # http://127.0.0.1:3333/mcp
```

Initialize:

```bash
curl -s -H "Authorization: Bearer dev-local-key" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"test","version":"1"}}}' \
  http://127.0.0.1:3333/mcp
```

Start a session:

```bash
curl -s -H "Authorization: Bearer dev-local-key" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"start_session","arguments":{"feature":"pricing page with plans"}}}' \
  http://127.0.0.1:3333/mcp
```

Verify a 401 without a key:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  http://127.0.0.1:3333/mcp
# expected: 401
```

## 4. Database verification (optional)

With `ux-kb/.env` configured:

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm kb:keys create --name local-dev --rate-limit 120
pnpm kb:keys list
```

Then start the HTTP server with `KB_STORE=db` and make one request. Re-run:

```bash
pnpm kb:keys list   # lastUsedAt should now be set
pnpm kb:keys gaps   # after a report_gap call, the topic appears
```

A server restart must still accept the same key (persistence check).

## 5. Web app (Next.js)

Local:

```bash
pnpm dev:web   # https://localhost:3000
```

Checks:

- `/` renders all sections; copy buttons work; responsive at 360/768/1280.
- `/api/healthz` returns `{ ok: true, kbVersion, docs }`.
- `/api/mcp` returns 401 without a Bearer key; 200 with a valid key.
- `/dashboard` redirects to `/signin` when signed out.
- Rate limit: a key with `--rate-limit 2` returns 429 on the 3rd request in a minute.
- `pnpm --filter @ux-kb/web build` succeeds (CI runs this).

## 6. Public site

- URL: https://ux-kb-site.vercel.app
- Check the hero, all sections, and the footer render.
- Click every "Copy" button and paste the result; confirm it matches the code block.
- Test at 360px, 768px, and 1280px widths.
- Tab through the page with the keyboard; confirm visible focus states.
- Confirm the GitHub link and docs links resolve.

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Could not locate the UX-KB content directory` | Server started outside the repo | Set `UX_KB_CONTENT_DIR` to the `content/` folder |
| `DATABASE_URL is not set` (kb:keys) | Running from the wrong directory | Run from `ux-kb/` or pass `--env-file=.env` |
| `the URL must start with the protocol postgresql://` | Quoted value in `.env` | Remove quotes around `DATABASE_URL` |
| `401 Missing, invalid or revoked API key` | Missing/wrong/revoked key | Create a key or use `MCP_DEV_KEY` |
| `409 Key is pinned to ...` | Key pinned to another release | Re-pin the key or deploy that release |
| `429 Rate limit exceeded` | Per-key limit reached | Wait for the window or raise `--rate-limit` |
| `SESSION_FORBIDDEN` | Session belongs to another key | Start a new session with this key |
| Site returns 401 | Vercel SSO protection enabled | Disable with `vercel project protection disable <name> --sso --yes` |

## 8. Final verification checklist

- [ ] `pnpm lint:kb:strict` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes
- [ ] `pnpm smoke` passes
- [ ] `pnpm smoke:http` passes
- [ ] Database `lastUsedAt` updates (if DB configured)
- [ ] Gap persists across restart (if DB configured)
- [ ] Public site loads over HTTPS
