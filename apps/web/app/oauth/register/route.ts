import type { NextRequest } from "next/server";
import { SCOPES } from "@/lib/oauth/config";
import { oauthError, oauthJson, oauthPreflight } from "@/lib/oauth/http";
import {
  parseRedirectUris,
  sanitizeClientName,
} from "@/lib/oauth/redirect";
import {
  registerClient,
  type ClientAuthMethod,
} from "@/lib/oauth/service";
import { getLimiter } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GRANT_TYPES = new Set(["authorization_code", "refresh_token"]);
const RESPONSE_TYPES = new Set(["code"]);
const AUTH_METHODS = new Set<ClientAuthMethod>([
  "none",
  "client_secret_post",
  "client_secret_basic",
]);

function stringList(value: unknown): string[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;
  if (value.some((entry) => typeof entry !== "string")) return null;
  return value.map((entry) => entry as string);
}

/**
 * RFC 7591 dynamic client registration.
 *
 * Open by design (MCP clients cannot ship pre-registered credentials), so the
 * endpoint is IP rate limited, rejects unknown metadata, and only accepts
 * HTTPS or loopback redirect URIs.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const ipHash = hashIp(clientIp(request.headers));
  const limit = await getLimiter().check(
    `oauth-register:${ipHash}`,
    30,
    Date.now(),
    "hour",
  );
  if (!limit.allowed) {
    return oauthError(
      "temporarily_unavailable",
      "Too many client registrations from this address. Try again later.",
      429,
      { "Retry-After": String(Math.max(1, Math.ceil(limit.retryAfterMs / 1000))) },
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return oauthError("invalid_client_metadata", "Body must be a JSON object.");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return oauthError("invalid_client_metadata", "Body must be valid JSON.");
  }

  const redirectUris = parseRedirectUris(body.redirect_uris);
  if (!redirectUris) {
    return oauthError(
      "invalid_redirect_uri",
      "redirect_uris must contain 1-5 absolute HTTPS URLs (HTTP is allowed only for loopback addresses).",
    );
  }

  const grantTypes = stringList(body.grant_types);
  if (!grantTypes) {
    return oauthError("invalid_client_metadata", "grant_types must be an array of strings.");
  }
  const effectiveGrantTypes =
    grantTypes.length > 0 ? grantTypes : ["authorization_code", "refresh_token"];
  if (effectiveGrantTypes.some((type) => !GRANT_TYPES.has(type))) {
    return oauthError(
      "invalid_client_metadata",
      "grant_types may contain authorization_code and refresh_token.",
    );
  }

  const responseTypes = stringList(body.response_types);
  if (!responseTypes) {
    return oauthError("invalid_client_metadata", "response_types must be an array of strings.");
  }
  const effectiveResponseTypes = responseTypes.length > 0 ? responseTypes : ["code"];
  if (effectiveResponseTypes.some((type) => !RESPONSE_TYPES.has(type))) {
    return oauthError("invalid_client_metadata", "response_types must contain code.");
  }

  const authMethod =
    typeof body.token_endpoint_auth_method === "string"
      ? body.token_endpoint_auth_method
      : "none";
  if (!AUTH_METHODS.has(authMethod as ClientAuthMethod)) {
    return oauthError(
      "invalid_client_metadata",
      "token_endpoint_auth_method must be none, client_secret_post, or client_secret_basic.",
    );
  }

  const requestedScopes =
    typeof body.scope === "string"
      ? body.scope.split(/\s+/).filter(Boolean)
      : [...SCOPES];
  const scopes = requestedScopes.length > 0 ? [...new Set(requestedScopes)] : [...SCOPES];
  if (scopes.some((scope) => !(SCOPES as readonly string[]).includes(scope))) {
    return oauthError(
      "invalid_client_metadata",
      `Supported scopes: ${SCOPES.join(", ")}.`,
    );
  }

  const name = sanitizeClientName(body.client_name);

  try {
    const client = await registerClient({
      name,
      redirectUris,
      grantTypes: effectiveGrantTypes,
      responseTypes: effectiveResponseTypes,
      scopes,
      tokenEndpointAuthMethod: authMethod as ClientAuthMethod,
      createdByIp: ipHash,
    });

    return oauthJson(
      {
        client_id: client.clientId,
        client_id_issued_at: Math.floor(Date.now() / 1000),
        client_name: client.name,
        redirect_uris: client.redirectUris,
        grant_types: effectiveGrantTypes,
        response_types: effectiveResponseTypes,
        token_endpoint_auth_method: client.tokenEndpointAuthMethod,
        scope: client.scopes.join(" "),
        ...(client.clientSecret
          ? { client_secret: client.clientSecret, client_secret_expires_at: 0 }
          : {}),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("oauth.register.failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return oauthError(
      "invalid_client_metadata",
      "Client registration could not be stored. Try again.",
      503,
    );
  }
}

export function OPTIONS(): Response {
  return oauthPreflight();
}
