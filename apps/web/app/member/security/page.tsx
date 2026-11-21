import { requireUser } from "@/lib/authz";
import PageHeader from "@/app/dashboard/page-header";
import MfaPanel from "@/app/dashboard/security/mfa-panel";
import SignOutButton from "@/app/dashboard/security/sign-out-button";

export const dynamic = "force-dynamic";

export default async function MemberSecurityPage() {
  const user = await requireUser();

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Security"
        description="How this session is authenticated and the second factor that protects your account."
      />

      <div className="adm-grid adm-grid-2">
        <section className="adm-card" aria-labelledby="identity-title">
          <h2 id="identity-title" className="adm-section-title">Identity</h2>
          <dl className="adm-kv">
            <dt>Signed in as</dt>
            <dd><strong>{user.name?.trim() || user.login}</strong> <span className="adm-muted">@{user.login}</span></dd>
            <dt>Role</dt>
            <dd><span className="adm-badge adm-badge-neutral">member</span></dd>
            <dt>MFA</dt>
            <dd>{user.mfaEnabled ? <span className="adm-badge adm-badge-success">enabled</span> : <span className="adm-badge adm-badge-neutral">not enrolled</span>}</dd>
            <dt>Last sign-in</dt>
            <dd>{user.lastLoginAt ? user.lastLoginAt.toLocaleString() : "—"}</dd>
          </dl>
        </section>

        <section className="adm-card" aria-labelledby="session-title">
          <h2 id="session-title" className="adm-section-title">Session</h2>
          <dl className="adm-kv">
            <dt>Type</dt>
            <dd>Signed JWT in an HTTP-only, SameSite=Lax cookie</dd>
            <dt>Lifetime</dt>
            <dd>8 hours · refreshed every 30 minutes while active</dd>
          </dl>
          <div style={{ marginTop: 14 }}>
            <SignOutButton />
          </div>
        </section>
      </div>

      <section className="adm-section" aria-labelledby="mfa-title">
        <h2 id="mfa-title" className="adm-section-title">Two-factor authentication</h2>
        <div className="adm-card">
          <MfaPanel enabled={user.mfaEnabled} />
        </div>
      </section>
    </div>
  );
}
