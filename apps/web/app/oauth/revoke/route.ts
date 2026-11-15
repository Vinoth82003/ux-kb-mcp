import type { NextRequest } from "next/server";
import { oauthError, oauthNoContent, oauthPreflight } from "@/lib/oauth/http";
import { findClient, revokeToken } from "@/lib/oauth/service";
import { verifyClientSecret } from "@/lib/oauth/tokens";
import { getLimiter } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
};

function parseBasic(header: string | null): { id: string; secret: string } | null {
  if (!header || !header.toLowerCase().startsWith("basic ")) return null;
  try {
    const decoded = Buffer.from(header.slice(6).trim(), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return {
      id: decodeURIComponent(decoded.slice(0, separator)),
      secret: decodeURIComponent(decoded.slice(separator + 1)),
    };
  } catch {
    return null;
  }
}

/**
 * RFC 7009 token revocation. Revocation is idempotent: an unknown token still
 * yields 200 so callers cannot probe token validity.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const ipHash = hashIp(clientIp(request.headers));
  const limit = await getLimiter().check(
    `oauth-revoke:${ipHash}`,
    120,
    Date.now(),
    "minute",
  );
  if (!limit.allowed) {
    return oauthError(
      "temporarily_unavailable",
      "Too many revocation requests. Try again later.",
      429,
      { "Retry-After": String(Math.max(1, Math.ceil(limit.retryAfterMs / 1000))) },
    );
  }

  const contentType = (request.headers.get("content-type") ?? "").toLowerCase();
  let params: URLSearchParams;
  if (contentType.includes("application/x-www-form-urlencoded")) {
    params = new URLSearchParams(await request.text());
  } else if (contentType.includes("application/json")) {
    try {
      const parsed: unknown = await request.json();
      params = new URLSearchParams();
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value === "string") params.set(key, value);
        }
      }
    } catch {
      return oauthError("invalid_request", "Body must be valid JSON.", 400, NO_STORE);
    }
  } else {
    return oauthError(
      "invalid_request",
      "Use Content-Type application/x-www-form-urlencoded.",
      400,
      NO_STORE,
    );
  }

  const basic = parseBasic(request.headers.get("authorization"));
  const clientId = basic?.id ?? params.get("client_id") ?? "";
  if (clientId) {
    const client = await findClient(clientId);
    if (!client) {
      return oauthError("invalid_client", "Unknown client_id.", 401, NO_STORE);
    }
    const secret = basic?.secret ?? params.get("client_secret") ?? "";
    if (client.tokenEndpointAuthMethod !== "none") {
      if (
        !secret ||
        !client.clientSecretHash ||
        !verifyClientSecret(secret, client.clientSecretHash)
      ) {
        return oauthError("invalid_client", "Client authentication failed.", 401, NO_STORE);
      }
    }
  }

  const token = params.get("token")?.trim() ?? "";
  if (!token) {
    return oauthError("invalid_request", "token is required.", 400, NO_STORE);
  }

  await revokeToken(token);
  return oauthNoContent();
}

export function OPTIONS(): Response {
  return oauthPreflight();
}
