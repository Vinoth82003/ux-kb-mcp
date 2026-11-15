import {
  authorizationServerMetadataUrl,
  oauthIssuer,
  protectedResourceUrl,
  resourceMetadataUrl,
  SCOPES,
} from "@/lib/oauth/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * RFC 8414 authorization-server metadata. MCP clients discover the dynamic
 * registration and token endpoints from here after reading the protected
 * resource metadata.
 */
export function GET(request: Request) {
  const issuer = oauthIssuer(request.headers);
  return Response.json(
    {
      issuer,
      authorization_endpoint: `${issuer}/oauth/authorize`,
      token_endpoint: `${issuer}/oauth/token`,
      registration_endpoint: `${issuer}/oauth/register`,
      revocation_endpoint: `${issuer}/oauth/revoke`,
      scopes_supported: [...SCOPES],
      response_types_supported: ["code"],
      response_modes_supported: ["query"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      token_endpoint_auth_methods_supported: [
        "none",
        "client_secret_post",
        "client_secret_basic",
      ],
      revocation_endpoint_auth_methods_supported: [
        "none",
        "client_secret_post",
        "client_secret_basic",
      ],
      code_challenge_methods_supported: ["S256"],
      authorization_response_iss_parameter_supported: true,
      service_documentation: `${issuer}/#connect`,
      metadata_url: authorizationServerMetadataUrl(request.headers),
      resource_metadata_url: resourceMetadataUrl(request.headers),
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
