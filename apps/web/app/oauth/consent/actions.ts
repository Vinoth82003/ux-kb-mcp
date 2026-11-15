"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/authz";
import { resolveAuthorizeRequest } from "@/lib/oauth/authorize";
import { oauthIssuer } from "@/lib/oauth/config";
import { issueAuthorizationCode } from "@/lib/oauth/service";
import { withQuery } from "@/lib/oauth/http";

const PARAM_KEYS = [
  "response_type",
  "client_id",
  "redirect_uri",
  "state",
  "code_challenge",
  "code_challenge_method",
  "scope",
  "resource",
] as const;

function authorizePath(params: URLSearchParams): string {
  const query = params.toString();
  return query ? `/oauth/authorize?${query}` : "/oauth/authorize";
}

/**
 * Approve or deny an authorization request. The client is only redirected
 * after its redirect URI has been re-validated against the database.
 */
export async function decideConsent(formData: FormData): Promise<void> {
  const requestHeaders = await headers();
  const params = new URLSearchParams();
  for (const key of PARAM_KEYS) {
    const value = formData.get(key);
    if (typeof value === "string" && value.length > 0) params.set(key, value);
  }

  const result = await resolveAuthorizeRequest(params, requestHeaders);
  if (!result.ok) {
    redirect(authorizePath(params));
  }

  const user = await getSessionUser();
  if (!user) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(authorizePath(params))}`);
  }

  const intent = String(formData.get("intent") ?? "deny");
  if (intent !== "approve") {
    redirect(
      withQuery(result.redirectUri, {
        error: "access_denied",
        error_description: "The user denied the authorization request.",
        state: result.state ?? undefined,
        iss: oauthIssuer(requestHeaders),
      }),
    );
  }

  const code = await issueAuthorizationCode({
    clientId: result.clientId,
    userId: user.id,
    redirectUri: result.redirectUri,
    scopes: result.scopes,
    codeChallenge: result.codeChallenge,
    resource: result.resource,
  });

  redirect(
    withQuery(result.redirectUri, {
      code,
      state: result.state ?? undefined,
      iss: oauthIssuer(requestHeaders),
    }),
  );
}
