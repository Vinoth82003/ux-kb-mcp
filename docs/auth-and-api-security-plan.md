# Auth, API-key, and API-security plan

Status: **implemented**. See `docs/security-checklist.md` and
`docs/auth-checklist.md` for the verified control list.

Goal: a public GitHub login that issues a scoped API key per user, a dashboard
that manages only the signed-in user's keys, and an `/api/mcp` endpoint that is
authenticated, rate limited, resource bounded, and auditable.

---

## 0. Current state (what already exists)

| Area | Today | Gap |
| --- | --- | --- |
| Login | Auth.js v5 GitHub provider, allowlist only | No user records; any allowlisted user sees every key |
| Keys | HMAC-SHA256 hash, `uxkb_` prefix, shown once | No owner, expiry, prefix display, rotation, or quota |
| Endpoint auth | Bearer key + revocation + release pin | No format pre-check, no body cap, no per-IP limit |
| Rate limit | Postgres fixed window per key | No daily quota, no cleanup, no anonymous limit |
| DoS | None | Unbounded tool inputs, batch size, body size, sessions |
| Headers | HSTS, nosniff, referrer, permissions | No CSP, frame-ancestors, COOP/CORP |
| Audit | `AuditLog` model exists, unused | No key or sign-in events recorded |
| Tests | Core + MCP smoke | No auth/authorization/limit tests |

---

## 1. Identity model

Add a `User` table and make keys belong to users.

```
User
  id            cuid
  githubId      String unique
  login         String unique        // GitHub handle
  email         String?
  name          String?
  avatarUrl     String?
  role          Role   @default(MEMBER)   // MEMBER | ADMIN
  suspendedAt   DateTime?
  createdAt     DateTime
  lastLoginAt   DateTime?

ApiKey (additions)
  ownerId       String  -> User.id
  prefix        String              // "uxkb_AbCdEf…" for display
  scopes        String[]            // ["mcp:read"]
  expiresAt     DateTime?
  lastUsedIp    String?
  revokedReason String?
```

- `role = ADMIN` when the GitHub login is in `ALLOWED_GITHUB_LOGINS`;
  everyone else is `MEMBER` (public sign-up mode) or rejected (allowlist mode).
- Every key query is filtered by `ownerId`. Admin-only views are explicit and
  server-checked.
- Add `AuditLog` fields: `metadata Json`, `ip`, `userAgent`, `actorUserId`.

## 2. Login and session (Auth.js)

- GitHub OAuth only; `trustHost: true`; `AUTH_URL` pinned to the production
  origin.
- `signIn` callback: upsert `User`, reject `suspendedAt`, assign role.
- `jwt` / `session` callbacks: expose `user.id`, `role`, `login`; never expose
  tokens or the GitHub access token.
- Session policy: JWT, `maxAge` 7 days, `updateAge` 24 h, `sameSite=lax`,
  `secure` in production, `httpOnly`.
- `/signin`: public page with a single GitHub button, `callbackUrl` support,
  friendly error states (cancelled, not allowed, suspended), no account
  enumeration.
- `/dashboard`: server-side `requireUser()` in the layout **and** in every
  server action — the `proxy.ts` redirect is defence in depth, not the control.
- Sign-out clears the cookie and returns to `/`.

GitHub OAuth app must register
`https://ux-kb-site.vercel.app/api/auth/callback/github`
(this is a manual step in GitHub → Developer settings → OAuth Apps).

## 3. API-key lifecycle

Create
- Max **3 active keys** per member, **10** per admin (configurable).
- Name: trimmed, 1–64 chars, control characters rejected.
- Rate limit: integer 10–600/min, default 60 (member) / 300 (admin).
- Expiry: 30 / 90 / 365 days or never; default 90 days.
- Scopes: `mcp:read` only in v1.
- Key = `uxkb_` + 24 random bytes base64url (192 bits).
- Store HMAC-SHA256(`KEY_HASH_SECRET`) only; show plaintext once.

Read
- Dashboard lists **only the caller's** keys: prefix, name, created, last used,
  expiry, status, rate limit.
- Never return `hashedKey` to any client.

Revoke / rotate
- Revoke own key only; writes `revokedAt` + `revokedReason` + audit entry.
- Rotate = create new key and revoke the old one in one transaction; plaintext
  shown once.
- Revocation takes effect on the next request (hash lookup already checks it).

Verification hardening
- Pre-validate format (`^uxkb_[A-Za-z0-9_-]{32}$`, max 64 chars) before any DB
  query.
- Hash lookup + constant-time behaviour; dummy hash on malformed input.
- Throttle `lastUsedAt` writes to at most once per 60 s per key.

## 4. `/api/mcp` endpoint security

Request
- `POST` only; `GET`/`DELETE` return `405` + `Allow: POST`.
- `Authorization: Bearer <key>` required; missing/invalid → `401` with
  `WWW-Authenticate: Bearer realm="ux-kb"`.
- Reject multiple `Authorization` headers.
- Body cap **256 KB** (413), JSON-RPC batch cap **20** (400).
- `Content-Type: application/json` required.
- No CORS by default; only `ADMIN_ORIGIN` if explicitly configured, never `*`
  with credentials.

Response
- `Cache-Control: no-store`.
- `X-Request-Id`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`,
  `X-RateLimit-Reset`, `Retry-After` on 429.
- Errors are JSON-RPC envelopes with stable codes and no stack traces.

Authorization
- Valid, non-revoked, non-expired key.
- Scope contains `mcp:read`.
- Release pin matches the served version, else `409`.
- Session tools verify the session belongs to the calling key
  (`SESSION_FORBIDDEN`).

## 5. Rate limiting and DoS protection

Layers
1. **Per key, per minute** — Postgres fixed window (exists), atomic upsert.
2. **Per key, per day** — quota window; member 10 000, admin 100 000.
3. **Per IP, unauthenticated** — 30/min to blunt 401 floods; IP hashed with
   `KEY_HASH_SECRET` and stored, never raw.
4. **Global concurrency** — per-instance semaphore (32) returning `503` +
   `Retry-After` when saturated.
5. **Window cleanup** — delete windows older than 2 days, opportunistically and
   via a daily Vercel cron.

Input bounds (DoS via payload size)
- `start_session.feature` ≤ 2 000 chars.
- `search_kb.query` ≤ 200 chars; `limit` 1–50 (already).
- `get_checklist.ids` ≤ 50; `verify_citations.citedIds` ≤ 100.
- `report_gap.topic` ≤ 200, `context` ≤ 2 000.
- Session creation ≤ 100/hour per key.
- DB calls wrapped in a 5 s timeout; endpoint `maxDuration = 60`.

## 6. Web hardening

- Headers: CSP (`default-src 'self'`, `object-src 'none'`, `base-uri 'self'`,
  `frame-ancestors 'none'`, `form-action 'self'`), `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, HSTS preload, `Cross-Origin-Opener-Policy`,
  `Cross-Origin-Resource-Policy`.
- `poweredByHeader: false`; `serverActions.allowedOrigins` pinned.
- Server actions: origin + method + auth checks; no key material in URLs or
  logs.
- Dashboard responses are `no-store`; secrets never rendered into HTML.
- Input validation with zod on every server action.

## 7. Audit and observability

- Audit events: `key.create`, `key.revoke`, `key.rotate`, `auth.signin`,
  `auth.denied`, `admin.key.revoke`, `user.suspend`.
- Structured logs: request id, key id, user id, tool, latency, status. Never the
  plaintext key, hash, or GitHub token.
- Usage logging stays per tool call; dashboard aggregates per key.

## 8. Tests and CI

- Unit: key format, hash determinism, expiry, revocation, quota windows,
  rate-limiter atomicity, ownership filters.
- Integration (local server): 401 / 403 / 405 / 409 / 413 / 429, cross-user key
  access denied, oversize body rejected, batch cap rejected.
- CI: typecheck, lint KB, unit tests, web build, `prisma validate`.

## 9. Docs and checklists

- `docs/security-checklist.md` — OWASP API Security Top 10 (2023) and key ASVS
  items mapped to the implementing file and status.
- `docs/auth-checklist.md` — login, session, key lifecycle, revocation.
- Update `docs/security-and-privacy.md`, `docs/testing.md`, `README.md`.

## 10. Rollout order

1. Schema + migration (`User`, key fields, audit fields, quota windows).
2. Auth callbacks + `/signin` + `/dashboard` authorization.
3. Key lifecycle UI and actions.
4. Endpoint hardening + rate/quota layers.
5. Input caps + concurrency + cleanup cron.
6. Headers + CSP + server-action origins.
7. Audit + logging.
8. Tests, checklists, docs.
9. Deploy, verify OAuth end-to-end, verify limits, update the OAuth callback.

## 11. Decisions needed

- **Sign-up mode**: public GitHub sign-in for any user (with quotas), or
  allowlist-only. Public is the stated goal; allowlist is safer.
- **Default quotas** for members: 60 req/min, 10 000/day, 3 keys, 90-day expiry.
- **Key expiry**: default 90 days, "never" allowed for admins only.
