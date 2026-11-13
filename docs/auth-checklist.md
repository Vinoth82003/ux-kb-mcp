# Authentication and API-key checklist

Covers sign-in, session handling, API-key lifecycle, revocation, and audit for
`apps/web`. Companion to `docs/security-checklist.md`.

---

## 1. Sign-in

| # | Requirement | Implementation | Status |
|---|---|---|---|
| 1.1 | Identity comes from GitHub OAuth (no passwords stored) | `auth.config.ts` — GitHub provider | Done |
| 1.2 | The OAuth callback is pinned to the production origin | `AUTH_URL`, `NEXTAUTH_URL`; GitHub app callback `https://ux-kb-site.vercel.app/api/auth/callback/github` | Done |
| 1.3 | `trustHost` is on, so Vercel's proxy host is honored | `authConfig.trustHost = true` | Done |
| 1.4 | A user row is upserted on every successful sign-in | `auth.ts` → `store.upsertUser` | Done |
| 1.5 | Role is assigned server-side: allowlisted login → `ADMIN`, otherwise `MEMBER` | `adminLogins()` in `auth.ts` | Done |
| 1.6 | Suspended accounts are rejected before a session is issued | `auth.ts` → `existing.suspendedAt` | Done |
| 1.7 | The error page is the same as the sign-in page, with friendly states | `pages.error = "/signin"`, `app/signin/page.tsx` | Done |
| 1.8 | `callbackUrl` is validated: only same-origin absolute paths are honored | `safeCallback()` in `app/signin/page.tsx` | Done |
| 1.9 | The sign-in page is `noindex` | `robots` metadata | Done |
| 1.10 | Sign-in and denial events are audited | `store.audit` in `auth.ts` | Done |

---

## 2. Session

| # | Requirement | Implementation | Status |
|---|---|---|---|
| 2.1 | JWT session strategy (no session table required) | `auth.config.ts` | Done |
| 2.2 | Session lifetime 7 days; refresh at most every 24 hours | `maxAge`, `updateAge` | Done |
| 2.3 | Cookie is `httpOnly`, `SameSite=Lax`, `Secure` in production | Auth.js defaults + HTTPS | Done |
| 2.4 | The token carries only `uid`, `role`, and `login` — no OAuth token | `jwt` callback | Done |
| 2.5 | The session is re-checked against the database on every dashboard render | `getSessionUser()` re-reads `User` | Done |
| 2.6 | A suspended user with a live cookie is treated as signed out | `getSessionUser()` returns `null` when `suspendedAt` | Done |
| 2.7 | `proxy.ts` redirects signed-out dashboard visits (defence in depth only) | `apps/web/proxy.ts` | Done |
| 2.8 | Every page and every server action re-authorizes server-side | `requireUser`, `requireAdmin`, `requireUserForAction` | Done |
| 2.9 | Sign-out clears the cookie and returns to `/` | `signOut({ redirectTo: "/" })` | Done |

---

## 3. API-key creation

| # | Requirement | Implementation | Status |
|---|---|---|---|
| 3.1 | Key format `uxkb_` + 24 random bytes, base64url (192 bits) | `generateApiKey()` | Done |
| 3.2 | Stored as HMAC-SHA256 with `KEY_HASH_SECRET`; never plaintext | `hashApiKey()` | Done |
| 3.3 | Plaintext is returned exactly once, from the create/rotate action | `createApiKey()` → server action | Done |
| 3.4 | Display prefix (`uxkb_AbCdEf`) is stored for identification | `keyPrefix()` | Done |
| 3.5 | Scopes default to `["mcp:read"]` | `createApiKey()` | Done |
| 3.6 | Active-key quota: 3 (member) / 10 (admin) | `KEY_LIMITS` | Done |
| 3.7 | Rate limit: integer 10–120 (member) / 10–600 (admin), default 60 / 300 | `createApiKey()` | Done |
| 3.8 | Expiry: 30 / 90 / 365 days; "never" is admin-only | `expiryFrom()` in `keys/actions.ts` | Done |
| 3.9 | Name is trimmed, 1–64 chars, restricted character set | `NAME_PATTERN` | Done |
| 3.10 | Creation is audited (`key.create`) | `recordAudit` | Done |
| 3.11 | The form warns that the key is shown once and offers copy | `create-key-form.tsx` | Done |

---

## 4. API-key use

| # | Requirement | Implementation | Status |
|---|---|---|---|
| 4.1 | `Authorization: Bearer <key>` accepted; a bare key also accepted for CLI use | `authenticate()` | Done |
| 4.2 | Syntactic validation happens before any DB query | `isWellFormedKey()` | Done |
| 4.3 | Hash lookup rejects revoked and expired keys | `authenticate()` | Done |
| 4.4 | Scope check (`mcp:read`) → 403 when missing | `lib/mcp-auth.ts` | Done |
| 4.5 | Owner suspension blocks the key | `lib/mcp-auth.ts` | Done |
| 4.6 | Pinned release mismatch → 409 | `lib/mcp-auth.ts` | Done |
| 4.7 | `lastUsedAt` / `lastUsedIp` are updated at most once per minute per key | `authenticate()` | Done |
| 4.8 | Rate-limit headers are returned on success | `X-RateLimit-*` in `route.ts` | Done |
| 4.9 | `Retry-After` is returned on 429 | `tooMany()` | Done |

---

## 5. Revocation and rotation

| # | Requirement | Implementation | Status |
|---|---|---|---|
| 5.1 | Owners can revoke their own key only | `revokeKeyAction` | Done |
| 5.2 | Revocation is effective on the next request (no cache) | hash lookup checks `revokedAt` | Done |
| 5.3 | A revoke reason is stored | `revokedReason` | Done |
| 5.4 | Rotation creates a replacement and revokes the old key in one action | `rotateKeyAction` | Done |
| 5.5 | Rotation keeps name, rate limit, expiry, pin, and scopes | same | Done |
| 5.6 | Rotation bypasses the active-key quota only because the old key is revoked immediately | `bypassKeyLimit` | Done |
| 5.7 | Revoke and rotate are audited (`key.revoke`, `key.rotate`) | `recordAudit` | Done |

---

## 6. Authorization boundaries

| # | Requirement | Implementation | Status |
|---|---|---|---|
| 6.1 | Dashboard lists only the caller's keys | `listKeysByOwner` | Done |
| 6.2 | Usage is aggregated per owner | `listUsageByOwner` | Done |
| 6.3 | Admin pages: users and gaps | `requireAdmin()` | Done |
| 6.4 | A non-admin visiting `/dashboard/users` is redirected to `/dashboard` | `requireAdmin()` | Done |
| 6.5 | An admin cannot suspend their own account | `setSuspendedAction` | Done |
| 6.6 | Suspension/restore is audited (`user.suspend`, `user.restore`) | `recordAudit` | Done |

---

## 7. Audit and logging

| Event | Recorded fields |
|---|---|
| `auth.signin` | actor `github:<login>`, user id, role |
| `auth.denied` | actor `github:<login>`, reason |
| `key.create` | user id, key id, name, rate limit |
| `key.revoke` | user id, key id, name |
| `key.rotate` | user id, old key id, replacement id |
| `user.suspend` / `user.restore` | admin id, target id, target login |

Audit rows also carry `ip`, `userAgent`, and `createdAt`. Plaintext keys,
hashes, and OAuth tokens are never written.

Audit writes are best-effort: a failure is logged as `audit.write_failed` and
does not break the request.

---

## 8. Operational tasks

| Task | How |
|---|---|
| Rotate `KEY_HASH_SECRET` | Issue new keys first, then swap the secret; existing hashes stop matching, so plan a cut-over. |
| Rotate `AUTH_SECRET` | Signing out all sessions is expected; set the new value and redeploy. |
| Add an admin | Add the GitHub login to `ALLOWED_GITHUB_LOGINS` and redeploy; the role is applied on next sign-in. |
| Suspend a user | Dashboard → Users → Suspend (admin only). |
| Revoke a compromised key | Dashboard → API keys → Revoke, or rotate to keep the client working. |
| Set `CRON_SECRET` | Vercel → Settings → Environment Variables (production/preview/development). |
| Register the OAuth callback | GitHub → Developer settings → OAuth Apps → callback URL `https://ux-kb-site.vercel.app/api/auth/callback/github`. |

---

## 9. Verification

```bash
pnpm test          # includes auth-security.test.ts
pnpm typecheck
pnpm --filter @ux-kb/web build
```

Manual checks are in `docs/testing.md` §5 and §6.
