import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";
import PageHeader from "@/app/dashboard/page-header";
import ConnectAgent from "@/components/connect-agent";
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

      <ConnectAgent keys={active.map((key) => ({ id: key.id, name: key.name, prefix: key.prefix }))} />

      <div className="adm-card" style={{ marginTop: 16 }}>
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

      <div className="adm-alert adm-alert-info" style={{ marginTop: 16 }}>
        You can read and use the knowledge base through your MCP client. Authoring,
        publishing, and administration require an admin account.
      </div>
    </div>
  );
}
