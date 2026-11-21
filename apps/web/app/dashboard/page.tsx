import Link from "next/link";
import { getKb } from "@/lib/kb";
import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";
import PageHeader from "./page-header";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const user = await requireUser();
  const kb = getKb();
  const store = await getStore();

  const [keys, usage, audit] = await Promise.all([
    store.listKeysByOwner(user.id),
    store.listUsageByOwner(user.id, 200),
    store.listAudit(6),
  ]);

  const active = keys.filter((key) => !key.revokedAt);
  // eslint-disable-next-line react-hooks/purity
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const callsToday = usage.filter((entry) => entry.createdAt.getTime() >= since).length;
  const nextExpiry = active
    .map((key) => key.expiresAt)
    .filter((value): value is Date => value instanceof Date)
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${user.name?.split(" ")[0] ?? user.login}`}
        description="The knowledge base, gate, and review surfaces in one place. Every action that changes state is written to the audit log."
        actions={
          <>
            <Link className="btn btn-primary" href="/dashboard/content/new">
              New document
            </Link>
            <Link className="btn btn-ghost" href="/dashboard/gate">
              Preview gate
            </Link>
          </>
        }
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{kb.docs().length}</span>
          <span className="adm-stat-label">Documents</span>
          <span className="adm-stat-hint">in release {kb.version}</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{kb.version}</span>
          <span className="adm-stat-label">KB version</span>
          <span className="adm-stat-hint">served to MCP clients</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{active.length}</span>
          <span className="adm-stat-label">Active keys</span>
          <span className="adm-stat-hint">{keys.length} total</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{callsToday}</span>
          <span className="adm-stat-label">Calls · 24h</span>
          <span className="adm-stat-hint">your keys only</span>
        </div>
      </div>

      <div className="adm-grid adm-grid-2">
        <section className="adm-card" aria-labelledby="connect-title">
          <h2 id="connect-title" className="adm-section-title">
            {active.length === 0 ? "Create your first API key" : "Connect an agent"}
          </h2>
          {active.length === 0 ? (
            <>
              <p className="adm-desc">
                Keys are shown once and stored only as a hash. Store yours in the MCP
                client config and never commit it.
              </p>
              <Link className="btn btn-primary" href="/dashboard/keys" style={{ marginTop: 12 }}>
                Create a key
              </Link>
            </>
          ) : (
            <>
              <p className="adm-desc" style={{ marginBottom: 10 }}>
                Send the key as a Bearer token to the hosted MCP endpoint.
              </p>
              <pre className="adm-pre">
                <code>{`claude mcp add --transport http ux-kb https://ux-kb-site.vercel.app/api/mcp \\
  --header "Authorization: Bearer <your-key>"`}</code>
              </pre>
              {nextExpiry && (
                <p className="adm-help" style={{ marginTop: 10 }}>
                  Next key expiry: {nextExpiry.toLocaleDateString()}
                </p>
              )}
            </>
          )}
        </section>

        <section className="adm-card" aria-labelledby="security-title">
          <div className="adm-section-head">
            <h2 id="security-title" className="adm-section-title">Security posture</h2>
            <Link href="/dashboard/security" className="adm-small">
              Manage
            </Link>
          </div>
          <dl className="adm-kv">
            <dt>Identity</dt>
            <dd>GitHub OAuth {user.githubId.startsWith("dev:") ? "(dev credentials)" : ""}</dd>
            <dt>Role</dt>
            <dd>
              <span className={`adm-badge ${user.role === "ADMIN" ? "adm-badge-warning" : "adm-badge-neutral"}`}>
                {user.role.toLowerCase()}
              </span>
            </dd>
            <dt>Session</dt>
            <dd>JWT · 8 hours · refreshed every 30 minutes</dd>
            <dt>MFA</dt>
            <dd>
              {user.mfaEnabled ? (
                <span className="adm-badge adm-badge-success">enabled</span>
              ) : (
                <span className="adm-badge adm-badge-neutral">not enrolled</span>
              )}
            </dd>
            <dt>Audit</dt>
            <dd>Append-only · mutation endpoints audited</dd>
          </dl>
          {!user.mfaEnabled && (
            <p className="adm-alert adm-alert-info" style={{ marginTop: 12 }}>
              Add a TOTP second factor to require a fresh code for publishing,
              key rotation, role changes, and release actions.
            </p>
          )}
        </section>
      </div>

      <section className="adm-section" aria-labelledby="activity-title">
        <div className="adm-section-head">
          <h2 id="activity-title" className="adm-section-title">Recent activity</h2>
          <Link href="/dashboard/audit" className="adm-small">
            Open audit log
          </Link>
        </div>
        {audit.length === 0 ? (
          <div className="adm-empty">
            <strong>No activity yet</strong>
            <p>Sign-ins and mutations will appear here.</p>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Actor</th>
                  <th scope="col">Action</th>
                  <th scope="col">Target</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((entry) => (
                  <tr key={entry.id}>
                    <td className="adm-nowrap">{entry.createdAt.toLocaleString()}</td>
                    <td>{entry.actor}</td>
                    <td><code className="adm-code">{entry.action}</code></td>
                    <td>{entry.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
