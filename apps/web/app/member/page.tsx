import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";
import PageHeader from "@/app/dashboard/page-header";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MemberOverview() {
  const user = await requireUser();
  const store = await getStore();
  const [keys, usage] = await Promise.all([
    store.listKeysByOwner(user.id),
    store.listUsageByOwner(user.id, 200),
  ]);
  const active = keys.filter((key) => !key.revokedAt);
  // eslint-disable-next-line react-hooks/purity
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const callsToday = usage.filter((entry) => entry.createdAt.getTime() >= since).length;

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title={`Welcome, ${user.name?.split(" ")[0] ?? user.login}`}
        description="Your API keys, usage, and security settings. Content authoring and release management are available to admins only."
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{active.length}</span>
          <span className="adm-stat-label">Active keys</span>
          <span className="adm-stat-hint">{keys.length} total</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{callsToday}</span>
          <span className="adm-stat-label">Calls · 24h</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{user.mfaEnabled ? "on" : "off"}</span>
          <span className="adm-stat-label">MFA</span>
        </div>
      </div>

      <div className="adm-grid adm-grid-2">
        <div className="adm-card">
          <h2 className="adm-section-title">Connect an agent</h2>
          {active.length === 0 ? (
            <>
              <p className="adm-desc">Create a key to start using UX-KB from your MCP client.</p>
              <Link className="btn btn-primary" href="/member/keys" style={{ marginTop: 12 }}>
                Create a key
              </Link>
            </>
          ) : (
            <>
              <p className="adm-desc" style={{ marginBottom: 10 }}>
                Send your key as a Bearer token to the hosted MCP endpoint.
              </p>
              <pre className="adm-pre">
                <code>{`claude mcp add --transport http ux-kb https://ux-kb-site.vercel.app/api/mcp \\\n  --header "Authorization: Bearer <your-key>"`}</code>
              </pre>
            </>
          )}
        </div>
        <div className="adm-card">
          <h2 className="adm-section-title">Security</h2>
          <dl className="adm-kv">
            <dt>Role</dt>
            <dd>Member</dd>
            <dt>MFA</dt>
            <dd>{user.mfaEnabled ? "enabled" : "not enrolled"}</dd>
            <dt>Session</dt>
            <dd>JWT · 8 hours</dd>
          </dl>
          <Link className="btn btn-ghost" href="/member/security" style={{ marginTop: 12 }}>
            Manage security
          </Link>
        </div>
      </div>

      <div className="adm-alert adm-alert-info" style={{ marginTop: 16 }}>
        You can read and use the knowledge base through your MCP client. Authoring,
        publishing, and administration require an admin account.
      </div>
    </div>
  );
}
