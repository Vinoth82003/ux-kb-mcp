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
pnpm lint:kb:strict                 # 0 errors, 0 warnings across 73 docs
pnpm typecheck                      # tsc in core, mcp, stdio, web
pnpm test                           # 35 core unit tests (incl. auth/security)
pnpm smoke                          # stdio end-to-end: 7 tools + 3 resources
pnpm smoke:http                     # HTTP: 401, initialize, start_session, 429, 409, revoked
pnpm --filter @ux-kb/web build      # Next.js production build
```

Expected: all commands exit 0. `pnpm smoke` prints `All smoke checks passed.`

## 2. Manual stdio session (Claude Code)

Register the server:

```bash
claude mcp add ux-kb -- node --import tsx \
  /absolute/path/to/ux-kb/apps/stdio/src/index.ts
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
- `/dashboard` redirects to `/signin` when signed out.
- `pnpm --filter @ux-kb/web build` succeeds (CI runs this).

### 5.1 Sign-in and keys

1. Open `/signin`, click **Continue with GitHub**, and authorize.
2. Confirm you land on `/dashboard` and the header shows `github:<login>`.
3. `/dashboard/keys` → create a key. Confirm the plaintext appears once, with a
   copy button, and that the list shows only the `uxkb_…` prefix afterwards.
4. Reload `/dashboard/keys`; confirm the plaintext is gone.
5. Create keys until the quota (3 for members, 10 for admins) is reached;
   confirm the next attempt is rejected with a clear message.
6. Rotate a key; confirm the new plaintext appears once and the old key is
   marked revoked. A request with the old key must return 401.
7. Revoke a key; the next request with it returns 401.
8. Sign out; `/dashboard` redirects to `/signin` again.
9. As a non-admin, open `/dashboard/users`; confirm the redirect to
   `/dashboard`. As an admin, confirm the page loads and suspend works.

### 5.2 `/api/mcp` security

Run against a built server (`pnpm --filter @ux-kb/web start -p 3100`) or the
production URL. Replace `<key>` with a real key.

| Check | Command | Expect |
|---|---|---|
| No key | `curl -i -X POST -H "Content-Type: application/json" -d '{}' <base>/api/mcp` | 401 + `WWW-Authenticate: Bearer realm="ux-kb"` |
| Bad key | same with `-H "Authorization: Bearer uxkb_aaaa…"` | 401 |
| Valid key | initialize request with the key | 200 + `X-RateLimit-*`, `X-Request-Id`, `Cache-Control: no-store` |
| Wrong method | `curl -i <base>/api/mcp` | 405 + `Allow: POST` |
| Wrong type | `-H "Content-Type: text/plain"` | 415 |
| Oversize | body > 256 KB | 413 |
| Big batch | array of 25 requests | 400 |
| Rate limit | send `limit + 1` requests in a minute | 429 + `Retry-After` |
| Cron | `GET /api/cron/cleanup` without the secret | 401; with `Authorization: Bearer $CRON_SECRET` → 200 |
| Headers | `curl -I <base>/` | CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, COOP; no `X-Powered-By` |

PowerShell one-liner for the rate-limit check:

```powershell
1..12 | ForEach-Object {
  curl.exe -s -o NUL -w "%{http_code} " -X POST `
    -H "Content-Type: application/json" -H "Authorization: Bearer $env:TEST_KEY" `
    -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' http://127.0.0.1:3100/api/mcp
}
# a key limited to 10/min prints ten 200s followed by 429s
```

### 5.3 Cross-user isolation

Create two users (two GitHub accounts) with one key each. From user A's
session, confirm `/dashboard/keys` and `/dashboard/usage` never show user B's
rows. Calling `revokeKeyAction` with B's key id from A's session must return
"Key not found."

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
| `401 Missing, invalid or revoked API key` | Missing/wrong/revoked/expired key | Create a key or use `MCP_DEV_KEY` |
| `403 This key does not grant mcp:read` | Key created without the scope | Create a new key; scopes are fixed at creation |
| `403 This account is suspended` | Owner suspended by an admin | Restore the user in `/dashboard/users` |
| `409 Key is pinned to ...` | Key pinned to another release | Re-pin the key or deploy that release |
| `413 Request body is too large` | Body over 256 KB | Send less data per request |
| `415 Content-Type must be application/json` | Wrong header | Set `Content-Type: application/json` |
| `429 Rate limit exceeded` | Per-key limit reached | Wait for the window or raise the key's limit |
| `503 Authentication backend unavailable` | Database unreachable | Check `DATABASE_URL` and Postgres health |
| `SESSION_FORBIDDEN` | Session belongs to another key | Start a new session with this key |
| Cron returns 401 | `CRON_SECRET` unset or wrong | Set it in Vercel and redeploy |
| Sign-in fails with `redirect_uri_mismatch` | GitHub callback URL not updated | Set it to `https://ux-kb-site.vercel.app/api/auth/callback/github` |
| Site returns 401 | Vercel SSO protection enabled | Disable with `vercel project protection disable <name> --sso --yes` |

## 8. Final verification checklist

- [ ] `pnpm lint:kb:strict` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (35 tests)
- [ ] `pnpm smoke` passes
- [ ] `pnpm smoke:http` passes
- [ ] `pnpm --filter @ux-kb/web build` passes
- [ ] GitHub sign-in reaches `/dashboard`
- [ ] Key create / rotate / revoke behave as described in §5.1
- [ ] `/api/mcp` returns 401, 405, 415, 413, 400, and 429 as described in §5.2
- [ ] Security headers present on `/`
- [ ] Cron cleanup returns 401 without `CRON_SECRET` and 200 with it
- [ ] Database `lastUsedAt` updates (if DB configured)
- [ ] Gap persists across restart (if DB configured)
- [ ] Public site loads over HTTPS
