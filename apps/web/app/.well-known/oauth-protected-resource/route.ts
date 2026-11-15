import { oauthIssuer, protectedResourceUrl, SCOPES } from "@/lib/oauth/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * RFC 9728 protected-resource metadata for the MCP endpoint. Clients append
 * the resource path to the well-known URL; the catch-all sibling route serves
 * that form, and this exact path is what the 401 challenge points at.
 */
export function GET(request: Request) {
  return Response.json(
    {
      resource: protectedResourceUrl(request.headers),
      resource_name: "UX-KB MCP",
      authorization_servers: [oauthIssuer(request.headers)],
      scopes_supported: [...SCOPES],
      bearer_methods_supported: ["header"],
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
        Vary: "Origin",
      },
    },
  );
}
