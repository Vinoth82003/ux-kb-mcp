/**
 * OAuth 2.1 configuration for the MCP endpoint.
 *
 * The issuer must be the public origin the client talks to; otherwise the
 * discovery document advertises endpoint URLs the client cannot reach and the
 * `iss`/`resource` checks fail. An explicit `AUTH_URL` wins, then the request's
 * forwarded host (correct on Vercel previews and custom domains), then the
 * Auth.js `NEXTAUTH_URL`, then localhost for development.
 */

const DEFAULT_ISSUER = "http://localhost:3000";

export const SCOPES = ["mcp:read"] as const;
export type OAuthScope = (typeof SCOPES)[number];

/** Access tokens are short-lived; refresh tokens rotate on every use. */
export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
export const AUTHORIZATION_CODE_TTL_SECONDS = 5 * 60;

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

function isLoopback(host: string): boolean {
  const name = host.toLowerCase();
  return (
    name.startsWith("localhost") ||
    name.startsWith("127.") ||
    name.startsWith("[::1]")
  );
}

/** Public origin derived from proxy headers, or null when unavailable. */
function requestOrigin(headers: Headers): string | null {
  const forwardedHost = headers.get("x-forwarded-host");
  const host = forwardedHost?.split(",")[0]?.trim() || headers.get("host");
  if (!host) return null;

  const forwardedProto = headers.get("x-forwarded-proto");
  const proto =
    forwardedProto?.split(",")[0]?.trim() || (isLoopback(host) ? "http" : "https");

  return `${proto}://${host}`;
}

export function oauthIssuer(headers?: Headers): string {
  const explicit = process.env.AUTH_URL?.trim();
  if (explicit) return stripTrailingSlashes(explicit);

  if (headers) {
    const origin = requestOrigin(headers);
    if (origin) return stripTrailingSlashes(origin);
  }

  const nextAuth = process.env.NEXTAUTH_URL?.trim();
  if (nextAuth) return stripTrailingSlashes(nextAuth);

  return DEFAULT_ISSUER;
}

export function protectedResourceUrl(headers?: Headers): string {
  return `${oauthIssuer(headers)}/api/mcp`;
}

export function resourceMetadataUrl(headers?: Headers): string {
  return `${oauthIssuer(headers)}/.well-known/oauth-protected-resource`;
}

export function authorizationServerMetadataUrl(headers?: Headers): string {
  return `${oauthIssuer(headers)}/.well-known/oauth-authorization-server`;
}

/** Keep only scopes this deployment understands, preserving order. */
export function normalizeScopes(raw: string | null | undefined): string[] {
  const requested = (raw ?? "")
    .split(/\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
  const scopes = requested.filter((scope) =>
    (SCOPES as readonly string[]).includes(scope),
  );
  return scopes.length > 0 ? [...new Set(scopes)] : [...SCOPES];
}

export function isSupportedScope(scope: string): boolean {
  return (SCOPES as readonly string[]).includes(scope);
}
