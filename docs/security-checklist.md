# API security checklist

Scope: the hosted MCP endpoint (`/api/mcp`), the GitHub sign-in flow, the API-key
lifecycle, and the dashboard in `apps/web`.

This checklist follows the **OWASP API Security Top 10 (2023)**. Each item names
the control that implements it, the file that owns the control, and how it is
verified. "Status" is about this repository, not a general security claim.

Legend: **Done** = implemented and covered by tests or a live check ·
**Partial** = implemented with a stated limitation · **N/A** = not applicable to
this service.

---

## API1 — Broken object level authorization

| # | Control | Where | Status |
|---|---|---|---|
| 1.1 | Keys are owned by a user; every dashboard query filters by `ownerId` | `apps/web/app/dashboard/*`, `store.listKeysByOwner` | Done |
| 1.2 | Revoke/rotate re-read the key and compare `ownerId` with the session user before acting | `apps/web/app/dashboard/keys/actions.ts` | Done |
| 1.3 | A key from another owner returns "Key not found" — existence is not disclosed | same file | Done |
| 1.4 | Session-scoped MCP tools verify the session belongs to the calling key (`SESSION_FORBIDDEN`) | `packages/mcp/src/server.ts`, `packages/core/src/services/session.service.ts` | Done |
| 1.5 | Admin-only pages call `requireAdmin()` server-side, not only in navigation | `apps/web/lib/authz.ts`, `app/dashboard/users`, `app/dashboard/gaps` | Done |
| 1.6 | User suspension is checked at sign-in **and** on every key-authenticated request | `auth.ts`, `lib/mcp-auth.ts` | Done |

Verification: `packages/core/src/__tests__/auth-security.test.ts` ("key listings
and usage are scoped to the owner").

---

## API2 — Broken authentication

| # | Control | Where | Status |
|---|---|---|---|
| 2.1 | Keys are 192-bit random values (`uxkb_` + 24 random bytes, base64url) | `packages/core/src/services/auth.service.ts` | Done |
| 2.2 | Only an HMAC-SHA256 hash is stored; plaintext is returned once | same file, `hashApiKey` | Done |
| 2.3 | Keys are validated syntactically (`^uxkb_[A-Za-z0-9_-]{32}$`, ≤ 64 chars) before any database call, so guessing cannot reach the DB | `isWellFormedKey` | Done |
| 2.4 | Revocation and expiry are enforced on every request | `authenticate` | Done |
| 2.5 | Keys carry explicit scopes (`mcp:read`); a key without the scope gets 403 | `hasScope`, `lib/mcp-auth.ts` | Done |
| 2.6 | Missing or invalid credentials return `401` with `WWW-Authenticate: Bearer realm="ux-kb"` | `lib/mcp-auth.ts` | Done |
| 2.7 | Sign-in is delegated to GitHub OAuth; the service never sees a password | `auth.ts` | Done |
| 2.8 | Sessions are signed JWTs, `httpOnly`, `SameSite=Lax`, `Secure` in production, 7-day lifetime with 24-hour refresh | `auth.config.ts` | Done |
| 2.9 | Sign-out is a server action that clears the cookie | `app/dashboard/layout.tsx` | Done |
| 2.10 | Account suspension blocks new sessions and existing keys | `auth.ts`, `lib/mcp-auth.ts` | Done |

Verification: `auth-security.test.ts` (format, hashing, revocation, expiry,
scope); live check that an invalid key returns 401.

---

## API3 — Broken object property level authorization

| # | Control | Where | Status |
|---|---|---|---|
| 3.1 | `hashedKey` is never serialized to a client; the dashboard renders `prefix` only | `app/dashboard/keys/page.tsx` | Done |
| 3.2 | The full key is only ever in the server action response for the one create/rotate call | `keys/actions.ts`, `create-key-form.tsx` | Done |
| 3.3 | Usage pages expose tool name, latency, and status only — not arguments | `app/dashboard/usage/page.tsx` | Done |
| 3.4 | Admin views expose login, role, key count, and status — no email by default | `app/dashboard/users/page.tsx` | Done |
| 3.5 | API errors return a stable JSON-RPC code and message, never stack traces or internal identifiers | `app/api/mcp/route.ts`, `lib/mcp-auth.ts` | Done |

---

## API4 — Unrestricted resource consumption

| # | Control | Value | Where | Status |
|---|---|---|---|---|
| 4.1 | Request body cap | 256 KB (declared and actual) | `app/api/mcp/route.ts` | Done |
| 4.2 | JSON-RPC batch cap | 20 items | same | Done |
| 4.3 | Per-key minute rate limit | 10–600, default 60 (member) / 300 (admin) | `RateLimitWindow`, `lib/mcp-auth.ts` | Done |
| 4.4 | Per-key daily quota | 10 000 (member) / 100 000 (admin) | `lib/rate-limit.ts` | Done |
| 4.5 | Anonymous per-IP limit | 30/min, keyed by a hashed IP | `lib/request.ts`, `lib/mcp-auth.ts` | Done |
| 4.6 | Session creation cap | 100/hour per key | `app/api/mcp/route.ts` | Done |
| 4.7 | Global concurrency guard | 32 in-flight requests per instance, `503` + `Retry-After` beyond that | `lib/concurrency.ts` | Done |
| 4.8 | Tool input caps | feature 2 000 · query 200 · ids 50 · citedIds 100 · topic 200 · context 2 000 | `packages/mcp/src/server.ts` | Done |
| 4.9 | Active keys per user | 3 (member) / 10 (admin) | `auth.service.ts` | Done |
| 4.10 | Endpoint timeout | `maxDuration = 60` | `app/api/mcp/route.ts` | Done |
| 4.11 | Rate-limit windows are pruned daily and opportunistically | older than 2 days | `app/api/cron/cleanup/route.ts` | Done |

Verification: unit test for the limiter; live checks for 413, 400 (batch), and
429 after the limit is reached.

Limitation: the concurrency guard is per serverless instance, so it bounds
CPU/memory pressure rather than global throughput.

---

## API5 — Broken function level authorization

| # | Control | Where | Status |
|---|---|---|---|
| 5.1 | Only `POST` is accepted on `/api/mcp`; `GET`/`DELETE` return 405 with `Allow: POST` | `app/api/mcp/route.ts` | Done |
| 5.2 | The cleanup cron requires `Authorization: Bearer $CRON_SECRET` and fails closed when the secret is unset | `app/api/cron/cleanup/route.ts` | Done |
| 5.3 | `setSuspendedAction` re-checks `role === "ADMIN"` inside the action | `app/dashboard/users/actions.ts` | Done |
| 5.4 | Admins cannot suspend themselves | same | Done |
| 5.5 | Every server action calls `requireUserForAction()` before touching data | `app/dashboard/*/actions.ts` | Done |

---

## API6 — Unrestricted access to sensitive business flows

| # | Control | Where | Status |
|---|---|---|---|
| 6.1 | Key creation is rate limited by the active-key quota, so bulk minting is bounded | `createApiKey` | Done |
| 6.2 | Rotation issues one replacement and revokes the old key in the same action | `keys/actions.ts` | Done |
| 6.3 | Gap reporting and usage logging are per-key and cannot be used to overwrite another key's records | `KbStore` contract | Done |
| 6.4 | Public sign-up is intentional; each new account is quota-limited from the first request | `auth.ts`, `lib/rate-limit.ts` | Done |

Limitation: there is no billing or payment flow to protect.

---

## API7 — Server side request forgery

| # | Control | Where | Status |
|---|---|---|---|
| 7.1 | The service makes no outbound HTTP requests derived from user input | — | N/A |
| 7.2 | GitHub OAuth endpoints are fixed provider URLs, not caller-supplied | `auth.config.ts` | Done |
| 7.3 | Content is read from a local directory, not fetched from a URL | `packages/core/src/content` | Done |

---

## API8 — Security misconfiguration

| # | Control | Where | Status |
|---|---|---|---|
| 8.1 | `Content-Security-Policy` with `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'` | `apps/web/next.config.ts` | Done |
| 8.2 | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` | same | Done |
| 8.3 | HSTS with `includeSubDomains; preload` | same | Done |
| 8.4 | `Cross-Origin-Opener-Policy: same-origin`; API routes set `Cross-Origin-Resource-Policy` | same | Done |
| 8.5 | `X-Powered-By` removed | `poweredByHeader: false` | Done |
| 8.6 | Dashboard and API responses are `Cache-Control: no-store` | same | Done |
| 8.7 | Server action body limit 64 KB and pinned allowed origins | `experimental.serverActions` | Done |
| 8.8 | No wildcard CORS; a cross-origin caller must be named in `ADMIN_ORIGIN` | `app/api/mcp/route.ts` | Done |
| 8.9 | `Content-Type: application/json` required on the MCP endpoint | same | Done |
| 8.10 | Secrets live in environment variables; `.env*` is gitignored; only `.env.example` is committed | `.gitignore` | Done |
| 8.11 | The public site and API are separate origins from any admin tooling; no directory listing | Next.js defaults | Done |

Verification: live header check on `/`.

---

## API9 — Improper inventory management

| # | Control | Where | Status |
|---|---|---|---|
| 9.1 | One documented public endpoint (`/api/mcp`) plus `/api/healthz`, `/api/auth/*`, `/api/cron/cleanup` | README, this file | Done |
| 9.2 | No legacy or undocumented API versions are deployed; the old Vercel projects were removed | — | Done |
| 9.3 | The served KB version is reported by `/api/healthz` and by every tool response | `lib/kb.ts`, `packages/mcp` | Done |
| 9.4 | Keys can be pinned to a KB release; a mismatch returns 409 | `lib/mcp-auth.ts` | Done |
| 9.5 | Audit rows record key and user lifecycle events | `lib/audit.ts`, `AuditLog` | Done |

---

## API10 — Unsafe consumption of third-party APIs

| # | Control | Where | Status |
|---|---|---|---|
| 10.1 | The only third party is GitHub OAuth; responses are read through the provider adapter and never trusted for authorization beyond `id`/`login` | `auth.ts` | Done |
| 10.2 | OAuth tokens are not persisted or exposed in the session | `auth.config.ts` | Done |
| 10.3 | Retrieved knowledge is treated as evidence, not instructions; only reviewed content is published | `docs/security-and-privacy.md` | Done |

---

## Transport and data handling

| # | Control | Status |
|---|---|---|
| T.1 | HTTPS only in production (Vercel), HSTS preload | Done |
| T.2 | Raw API keys and `Authorization` headers are never logged | Done |
| T.3 | IPs are HMAC-hashed before being stored in the rate-limit table | Done |
| T.4 | `KEY_HASH_SECRET` rotation requires re-issuing keys; documented | Done |
| T.5 | Database access uses pooled `DATABASE_URL` at runtime and `DIRECT_URL` for migrations | Done |

---

## Known limitations

1. **Rate limiting is fixed-window**, so a caller can burst up to 2× the limit
   across a window boundary. Acceptable for abuse control, not for billing.
2. **The concurrency guard is per instance.** Vercel may run several instances.
3. **Audit writes are best-effort.** A failed audit write is logged and the
   request continues, so audit is not a tamper-proof ledger.
4. **Citation verification proves fetch history**, not semantic support.
5. **Usage logs store tool arguments.** Callers must not put secrets in
   `feature`, `context`, or query text.
6. **No WAF.** Platform-level DDoS protection is delegated to Vercel.

## Re-verification

```bash
pnpm typecheck
pnpm test
pnpm --filter @ux-kb/web build
```

Then run the manual checks in `docs/testing.md` §5.
