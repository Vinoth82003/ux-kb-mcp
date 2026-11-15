import { protectedResourceUrl, SCOPES } from "./config";
import { findClient } from "./service";
import { isValidPkceChallenge } from "./tokens";

export interface ResolvedAuthorize {
  ok: true;
  clientId: string;
  clientName: string;
  redirectUri: string;
  scopes: string[];
  state: string | null;
  codeChallenge: string;
  resource: string | null;
}

export interface AuthorizeFailure {
  ok: false;
  error: string;
  description: string;
  status: number;
  /** Present only when the redirect URI has been verified. */
  redirectUri: string | null;
  state: string | null;
}

export type AuthorizeResolution = ResolvedAuthorize | AuthorizeFailure;

function failure(
  error: string,
  description: string,
  options: { status?: number; redirectUri?: string | null; state?: string | null } = {},
): AuthorizeFailure {
  return {
    ok: false,
    error,
    description,
    status: options.status ?? 400,
    redirectUri: options.redirectUri ?? null,
    state: options.state ?? null,
  };
}

/**
 * Validate an authorization request. Errors are only returned to the client
 * after the redirect URI has been matched against the registered value, which
 * prevents using this endpoint as an open redirect.
 */
export async function resolveAuthorizeRequest(
  params: URLSearchParams,
  headers?: Headers,
): Promise<AuthorizeResolution> {
  const clientId = params.get("client_id")?.trim() ?? "";
  if (!clientId) {
    return failure("invalid_request", "client_id is required.");
  }

  const client = await findClient(clientId);
  if (!client) {
    return failure("invalid_client", "Unknown client_id.");
  }

  const requestedRedirect = params.get("redirect_uri")?.trim() ?? "";
  const redirectUri =
    requestedRedirect || (client.redirectUris.length === 1 ? client.redirectUris[0] : "");
  if (!redirectUri || !client.redirectUris.includes(redirectUri)) {
    return failure(
      "invalid_request",
      "redirect_uri must exactly match a URI registered for this client.",
    );
  }

  const state = params.get("state");
  const safeState = state && state.length <= 2048 ? state : null;

  if (params.get("response_type") !== "code") {
    return failure("unsupported_response_type", "Only response_type=code is supported.", {
      redirectUri,
      state: safeState,
    });
  }

  const codeChallenge = params.get("code_challenge")?.trim() ?? "";
  const challengeMethod = params.get("code_challenge_method") ?? "plain";
  if (!codeChallenge || challengeMethod !== "S256") {
    return failure(
      "invalid_request",
      "PKCE with code_challenge_method=S256 is required.",
      { redirectUri, state: safeState },
    );
  }
  if (!isValidPkceChallenge(codeChallenge)) {
    return failure("invalid_request", "code_challenge must be a BASE64URL SHA-256 digest.", {
      redirectUri,
      state: safeState,
    });
  }

  const requestedScopes = (params.get("scope") ?? "")
    .split(/\s+/)
    .map((scope) => scope.trim())
    .filter(Boolean);
  const scopes =
    requestedScopes.length > 0
      ? [...new Set(requestedScopes)]
      : client.scopes.length > 0
        ? client.scopes
        : [...SCOPES];

  const unsupported = scopes.filter(
    (scope) => !(SCOPES as readonly string[]).includes(scope),
  );
  if (unsupported.length > 0) {
    return failure(
      "invalid_scope",
      `Unsupported scope(s): ${unsupported.join(", ")}. Supported: ${SCOPES.join(", ")}.`,
      { redirectUri, state: safeState },
    );
  }

  const resource = params.get("resource");
  if (resource && resource !== protectedResourceUrl(headers)) {
    return failure("invalid_target", "Unknown resource indicator.", {
      redirectUri,
      state: safeState,
    });
  }

  return {
    ok: true,
    clientId: client.clientId,
    clientName: client.name,
    redirectUri,
    scopes,
    state: safeState,
    codeChallenge,
    resource: resource ?? null,
  };
}
