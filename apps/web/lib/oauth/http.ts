import { oauthIssuer } from "./config";

/**
 * OAuth endpoints are called by native MCP clients and by browser-based
 * integrations, so they answer permissive CORS. No cookies are used here, so
 * `*` does not expose a credentialed session.
 */
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
};

export function oauthJson(
  body: unknown,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      ...init.headers,
    },
  });
}

export function oauthError(
  error: string,
  description: string,
  status = 400,
  extraHeaders: Record<string, string> = {},
): Response {
  return oauthJson(
    { error, error_description: description },
    { status, headers: extraHeaders },
  );
}

export function oauthPreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/** RFC 7009 success: 200 with an empty body. */
export function oauthNoContent(): Response {
  return new Response(null, {
    status: 200,
    headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
  });
}

export function metadataJson(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Human-readable failure page for authorization requests that cannot be sent
 * back to the client (unknown client, unregistered redirect URI). Never
 * redirect to an unverified URI.
 */
export function authorizeErrorPage(
  title: string,
  detail: string,
  status = 400,
  headers?: Headers,
): Response {
  const safeTitle = escapeHtml(title);
  const safeDetail = escapeHtml(detail);
  const issuer = escapeHtml(oauthIssuer(headers));
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${safeTitle} — UX-KB</title>
<style>
  :root { color-scheme: dark light; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
    background: #0b0d12; color: #e8ecf4;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; padding: 24px; }
  main { max-width: 440px; background: #151922; border: 1px solid #2a3140;
    border-radius: 16px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,.45); }
  h1 { margin: 0 0 12px; font-size: 1.4rem; letter-spacing: -0.01em; }
  p { margin: 0 0 16px; color: #a9b3c6; line-height: 1.55; font-size: .95rem; }
  code { background: #0f131b; border: 1px solid #2a3140; border-radius: 6px;
    padding: 2px 6px; font-size: .82rem; }
  a { color: #f97316; }
</style>
</head>
<body>
<main>
  <h1>${safeTitle}</h1>
  <p>${safeDetail}</p>
  <p>Issuer: <code>${issuer}</code></p>
  <p><a href="/">Return to UX-KB</a></p>
</main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    },
  });
}

/** Append query parameters to a redirect URI without dropping existing ones. */
export function withQuery(
  uri: string,
  params: Record<string, string | undefined>,
): string {
  const url = new URL(uri);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, value);
  }
  return url.toString();
}
