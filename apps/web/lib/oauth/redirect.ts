/**
 * Redirect URI hygiene for dynamic client registration.
 *
 * Open registration plus an unvalidated redirect URI is an open redirect that
 * hands authorization codes to an attacker. Only HTTPS and loopback HTTP are
 * accepted, which covers browser-based MCP clients and native clients using a
 * local callback listener.
 */

const MAX_REDIRECT_URI_LENGTH = 2048;

function isLoopbackHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host === "[::1]" || host === "::1") return true;
  return /^127(?:\.\d{1,3}){3}$/.test(host);
}

export function isAcceptableRedirectUri(value: string): boolean {
  if (!value || value.length > MAX_REDIRECT_URI_LENGTH) return false;
  if (value.includes("#")) return false;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.username || url.password) return false;
  if (url.protocol === "https:") return true;
  if (url.protocol === "http:") return isLoopbackHost(url.hostname);
  return false;
}

/** Validate a registration payload's redirect URI list. */
export const DEFAULT_GOOGLE_REDIRECT_URIS: string[] = [
  "https://vertexaisearch.cloud.google.com/oauth-redirect",
  "https://gemini.google.com/oauth-redirect",
  "https://oauth-redirect.googleusercontent.com/r",
  "https://oauth-redirect-sandbox.googleusercontent.com/r",
  "https://oauth-redirect-test.googleusercontent.com/r",
];

export function parseRedirectUris(input: unknown): string[] | null {
  if (typeof input === "string") input = [input];
  if (input === undefined || input === null) return [...DEFAULT_GOOGLE_REDIRECT_URIS];
  if (!Array.isArray(input)) return null;
  if (input.length === 0) return [...DEFAULT_GOOGLE_REDIRECT_URIS];
  if (input.length > 10) return null;
  const uris: string[] = [];
  for (const entry of input) {
    if (typeof entry !== "string") continue;
    const value = entry.trim();
    if (!isAcceptableRedirectUri(value)) continue;
    if (!uris.includes(value)) uris.push(value);
  }
  return uris.length > 0 ? uris : [...DEFAULT_GOOGLE_REDIRECT_URIS];
}

/** Trim control characters and cap the display name at 80 characters. */
export function sanitizeClientName(input: unknown): string {
  const raw = typeof input === "string" ? input : "";
  // eslint-disable-next-line no-control-regex
  const cleaned = raw.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return cleaned.slice(0, 80) || "MCP client";
}
