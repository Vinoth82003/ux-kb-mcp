# Security and privacy

How UX-KB protects keys, sessions, and the hosted MCP endpoint. Implementation
details live in `docs/security-checklist.md` (OWASP API Top 10) and
`docs/auth-checklist.md` (sign-in and key lifecycle).

## Credentials

- API keys are `uxkb_` plus 192 random bits. The plaintext is shown once, at
  creation or rotation, and never stored.
- The database keeps an HMAC-SHA256 hash keyed by `KEY_HASH_SECRET`. Rotating
  that secret invalidates every existing key, so rotate by issuing new keys
  first.
- Keys are checked syntactically before any database lookup, which keeps key
  guessing away from the database.
- Revocation is immediate: the next request fails. Expiry is enforced the same
  way.
- Keys carry scopes. Today the only scope is `mcp:read`, so a future
  write-capable key cannot silently inherit read-only assumptions.

## Sessions

- Identity comes from GitHub OAuth. The service stores the GitHub id, login,
  display name, avatar URL, and (if GitHub shares it) the primary email.
- Sessions are signed JWTs with a 7-day lifetime and a 24-hour refresh window,
  stored in an `httpOnly`, `SameSite=Lax`, `Secure` cookie in production.
- The GitHub access token is not persisted and is not exposed in the session.
- A suspended account cannot start a new session, and any live session is
  treated as signed out because the dashboard re-reads the user row.
- `ALLOWED_GITHUB_LOGINS` grants `ADMIN`. Everyone else who signs in is a
  `MEMBER` with tighter quotas.

## Authorization

- Every key query is filtered by owner. A caller cannot list, revoke, or rotate
  another user's key, and the response does not reveal whether the key exists.
- Session-scoped MCP tools verify that the session belongs to the calling key.
- Admin pages and admin actions re-check the role on the server. The navigation
  only hides links; it is not the control.
- `proxy.ts` is a convenience redirect, not an authorization boundary.

## Rate limiting and abuse control

- Per key: a fixed one-minute window (10–600 requests, default 60 for members)
  and a daily quota (10 000 member / 100 000 admin).
- Anonymous callers: 30 requests per minute per hashed IP, so failed
  authentication is not free.
- Sessions: 100 per hour per key.
- Global: a 32-request per-instance concurrency guard returns `503` with
  `Retry-After` when saturated.
- Windows are pruned daily by a Vercel cron and opportunistically in the MCP
  route.

## Request bounds

`/api/mcp` accepts `POST` with `Content-Type: application/json` only. Bodies
are capped at 256 KB and JSON-RPC batches at 20 items. Tool inputs have their
own caps (feature 2 000 chars, query 200, ids 50, citations 100, topic 200,
context 2 000). Oversized or malformed input is rejected before it reaches the
knowledge base.

## Headers and transport

Production runs behind Vercel with HTTPS and HSTS preload. Responses set a
Content Security Policy, `X-Frame-Options: DENY`, `nosniff`, a referrer policy,
a permissions policy, and `Cross-Origin-Opener-Policy: same-origin`. Dashboard
and API responses are `no-store`. `X-Powered-By` is removed. CORS is closed
unless a specific origin is configured in `ADMIN_ORIGIN`.

## Data we keep

| Data | Why | Retention |
|---|---|---|
| User row (GitHub id, login, name, avatar, role) | Identity and authorization | Until deletion is requested |
| API key hash, prefix, scopes, expiry, last use | Authentication and display | Until the key is deleted |
| Session rows | Session ownership and citation checks | Until the key is deleted |
| Usage rows (tool, arguments, latency, status) | Quotas and debugging | Not yet automated; plan a retention window |
| Gap rows (topic, context) | Content planning | Until resolved |
| Audit rows (actor, action, target, IP, user agent) | Security review | Not yet automated |
| Rate-limit windows (keyed by key id or hashed IP) | Abuse control | Pruned after 2 days |

Raw client IPs are never written to the rate-limit table; only an HMAC of the
address is stored. Audit rows do store the IP supplied by the platform.

## Logging

Structured logs contain the request id, key id, user id, tool name, latency,
and status. They never contain a plaintext key, a key hash, an authorization
header, or a GitHub token. Audit writes are best-effort: a failure is logged as
`audit.write_failed` and the request continues.

## Content trust

Treat knowledge edits as privileged input because agents follow retrieved
instructions. Only reviewed content is published, and retrieved pages or user
content are treated as evidence, not system instructions. Citation verification
proves that an ID was fetched in the session; it does not prove that the source
supports the claim.

## Deletion

There is no self-service account deletion yet. To remove a user, revoke their
keys, then delete the user row; keys, sessions, and usage cascade. Record the
request in the audit log before deleting.
