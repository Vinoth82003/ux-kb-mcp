import type { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/authz";
import { resolveAuthorizeRequest } from "@/lib/oauth/authorize";
import { oauthIssuer } from "@/lib/oauth/config";
import { authorizeErrorPage, withQuery } from "@/lib/oauth/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Authorization endpoint. Validates the request, ensures a GitHub session, and
 * hands off to the consent screen. Nothing is approved without an explicit
 * POST from the signed-in user.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const params = request.nextUrl.searchParams;
  const result = await resolveAuthorizeRequest(params, request.headers);

  if (!result.ok) {
    if (result.redirectUri) {
      return Response.redirect(
        withQuery(result.redirectUri, {
          error: result.error,
          error_description: result.description,
          state: result.state ?? undefined,
          iss: oauthIssuer(request.headers),
        }),
        303,
      );
    }
    return authorizeErrorPage(
      "Authorization request rejected",
      result.description,
      result.status,
      request.headers,
    );
  }

  const user = await getSessionUser();
  if (!user) {
    const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    const signin = new URL("/signin", request.nextUrl.origin);
    signin.searchParams.set("callbackUrl", callbackUrl);
    return Response.redirect(signin, 303);
  }

  const consent = new URL("/oauth/consent", request.nextUrl.origin);
  for (const [key, value] of params) consent.searchParams.append(key, value);
  return Response.redirect(consent, 303);
}
