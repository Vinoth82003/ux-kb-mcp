import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/authz";
import { resolveAuthorizeRequest } from "@/lib/oauth/authorize";
import { decideConsent } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Authorize access — UX-KB",
  description: "Approve or deny an MCP client's request to access your UX-KB knowledge base.",
  robots: { index: false, follow: false },
};

const SCOPE_COPY: Record<string, string> = {
  "mcp:read":
    "Read published UX-KB docs, search the knowledge base, load stage packs, and start retrieval sessions.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toParams(raw: Record<string, string | string[] | undefined>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && typeof value[0] === "string") params.set(key, value[0]);
  }
  return params;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="consent-page">
      <div className="consent-shell">
        <Link className="signin-brand consent-brand" href="/" aria-label="UX-KB home">
          <img
            className="signin-brand-mark"
            src="/mascot/pose-01-brand-mark.svg"
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
            decoding="async"
          />
          <span>UX-KB</span>
        </Link>
        {children}
      </div>
    </main>
  );
}

export default async function ConsentPage({ searchParams }: { searchParams: SearchParams }) {
  const params = toParams(await searchParams);
  const result = await resolveAuthorizeRequest(params, await headers());

  if (!result.ok) {
    return (
      <Shell>
        <section className="consent-card" aria-labelledby="consent-error-title">
          <p className="eyebrow">Authorization</p>
          <h1 id="consent-error-title" className="consent-title">
            This request can&apos;t be authorized.
          </h1>
          <p className="consent-copy" role="alert">
            {result.description}
          </p>
          <p className="consent-back">
            <Link href="/">Back to UX-KB</Link>
          </p>
        </section>
      </Shell>
    );
  }

  const user = await getSessionUser();
  if (!user) {
    const target = params.toString();
    redirect(`/signin?callbackUrl=${encodeURIComponent(target ? `/oauth/authorize?${target}` : "/oauth/authorize")}`);
  }

  const targetHost = new URL(result.redirectUri).host;

  return (
    <Shell>
      <section className="consent-card" aria-labelledby="consent-title">
        <p className="eyebrow">MCP authorization</p>
        <h1 id="consent-title" className="consent-title">
          Allow {result.clientName} to access UX-KB?
        </h1>
        <p className="consent-copy">
          <strong>{targetHost}</strong> is asking to act on your behalf. Approving creates a
          scoped token; you can revoke it later from your dashboard.
        </p>

        <div className="consent-scopes" role="list" aria-label="Requested permissions">
          {result.scopes.map((scope) => (
            <div className="consent-scope" role="listitem" key={scope}>
              <span className="consent-scope-name">{scope}</span>
              <span className="consent-scope-copy">
                {SCOPE_COPY[scope] ?? "Access this scope."}
              </span>
            </div>
          ))}
        </div>

        <div className="consent-account">
          {user.avatarUrl ? (
            <img
              className="consent-avatar"
              src={user.avatarUrl}
              alt=""
              aria-hidden="true"
              width={34}
              height={34}
              referrerPolicy="no-referrer"
            />
          ) : null}
          <span>
            Signed in as <strong>{user.login}</strong>
          </span>
        </div>

        <form className="consent-form" action={decideConsent}>
          <input type="hidden" name="response_type" value="code" />
          <input type="hidden" name="client_id" value={result.clientId} />
          <input type="hidden" name="redirect_uri" value={result.redirectUri} />
          <input type="hidden" name="code_challenge" value={result.codeChallenge} />
          <input type="hidden" name="code_challenge_method" value="S256" />
          <input type="hidden" name="scope" value={result.scopes.join(" ")} />
          {result.state ? <input type="hidden" name="state" value={result.state} /> : null}
          {result.resource ? <input type="hidden" name="resource" value={result.resource} /> : null}

          <div className="consent-actions">
            <button className="btn btn-secondary" type="submit" name="intent" value="deny">
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" name="intent" value="approve">
              Allow access
            </button>
          </div>
        </form>

        <p className="consent-trust">
          <img
            className="consent-shield"
            src="/mascot/pose-08-guardian.svg"
            alt=""
            aria-hidden="true"
            width={42}
            height={38}
            decoding="async"
          />
          <span>
            UX-KB only returns published knowledge. The client never receives your GitHub
            password or session cookie.
          </span>
        </p>
      </section>
    </Shell>
  );
}
