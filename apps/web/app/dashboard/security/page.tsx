import { requireUser } from "@/lib/authz";
import { ACTION_MATRIX, can } from "@/lib/policy";
import PageHeader from "../page-header";
import MfaPanel from "./mfa-panel";
import SignOutButton from "./sign-out-button";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const user = await requireUser();
  const isDev = user.githubId.startsWith("dev:");

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Security"
        description="How this session is authenticated, what your role can do, and the second factor that protects privileged actions."
      />

      <div className="adm-grid adm-grid-2">
        <section className="adm-card" aria-labelledby="identity-title">
          <h2 id="identity-title" className="adm-section-title">
            Identity
          </h2>
          <dl className="adm-kv">
            <dt>Signed in as</dt>
            <dd>
              <strong>{user.name?.trim() || user.login}</strong>{" "}
              <span className="adm-muted">@{user.login}</span>
            </dd>
            <dt>Identity provider</dt>
            <dd>{isDev ? "Dev credentials (not production auth)" : "GitHub OAuth"}</dd>
            <dt>Role</dt>
            <dd>
              <span className={`adm-badge ${user.role === "ADMIN" ? "adm-badge-warning" : "adm-badge-neutral"}`}>
                {user.role.toLowerCase()}
              </span>
            </dd>
            <dt>MFA</dt>
            <dd>
              {user.mfaEnabled ? (
                <span className="adm-badge adm-badge-success">enabled</span>
              ) : (
                <span className="adm-badge adm-badge-neutral">not enrolled</span>
              )}
            </dd>
            <dt>Last sign-in</dt>
            <dd>{user.lastLoginAt ? user.lastLoginAt.toLocaleString() : "—"}</dd>
            <dt>Account created</dt>
            <dd>{user.createdAt.toLocaleDateString()}</dd>
          </dl>
        </section>

        <section className="adm-card" aria-labelledby="session-title">
          <h2 id="session-title" className="adm-section-title">
            Session
          </h2>
          <dl className="adm-kv">
            <dt>Type</dt>
            <dd>Signed JWT in an HTTP-only, SameSite=Lax cookie</dd>
            <dt>Lifetime</dt>
            <dd>8 hours · refreshed every 30 minutes while active</dd>
            <dt>Revocation</dt>
            <dd>Suspending the account blocks new sessions and revokes its keys</dd>
            <dt>Mutations</dt>
            <dd>Same-origin checked, role-checked server-side, audited</dd>
          </dl>
          <div style={{ marginTop: 14 }}>
            <SignOutButton />
          </div>
        </section>
      </div>

      <section className="adm-section" aria-labelledby="mfa-title">
        <h2 id="mfa-title" className="adm-section-title">
          Two-factor authentication
        </h2>
        <div className="adm-card">
          <MfaPanel enabled={user.mfaEnabled} />
        </div>
      </section>

      <section className="adm-section" aria-labelledby="matrix-title">
        <div className="adm-section-head">
          <h2 id="matrix-title" className="adm-section-title">
            Capability matrix
          </h2>
          <span className="adm-help">Enforced in the API, not just the UI</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Actions and whether your current role allows them</caption>
            <thead>
              <tr>
                <th scope="col">Action</th>
                <th scope="col">Member</th>
                <th scope="col">Admin</th>
                <th scope="col">You</th>
              </tr>
            </thead>
            <tbody>
              {ACTION_MATRIX.map((row) => {
                const allowed = can(user, row.action);
                return (
                  <tr key={row.action}>
                    <td>
                      <code className="adm-code">{row.action}</code>
                      <div className="adm-muted adm-small">{row.label}</div>
                    </td>
                    <td>{row.member ? "yes" : "—"}</td>
                    <td>yes</td>
                    <td>
                      <span className={`adm-badge ${allowed ? "adm-badge-success" : "adm-badge-neutral"}`}>
                        {allowed ? "allowed" : "denied"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="adm-help" style={{ marginTop: 10 }}>
          The API returns 403 for denied actions even when a request is sent directly,
          bypassing this panel.
        </p>
      </section>
    </div>
  );
}
