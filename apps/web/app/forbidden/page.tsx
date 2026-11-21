import Link from "next/link";

export default function Forbidden() {
  return (
    <main className="signin-page">
      <div className="signin-shell" style={{ gridTemplateColumns: "1fr" }}>
        <section className="signin-card" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Link className="signin-brand" href="/" aria-label="UX-KB home" style={{ justifyContent: "center" }}>
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
          <img
            src="/mascot/pose-08-guardian.svg"
            alt="UX-KB Guardian"
            width={140}
            height={128}
            style={{ margin: "16px auto 8px" }}
          />
          <p className="eyebrow" style={{ marginTop: 8 }}>403 Forbidden</p>
          <h1 className="signin-title" style={{ fontSize: "1.75rem" }}>
            Access restricted
          </h1>
          <p className="signin-subtitle">
            You do not have permission to view this resource. Authoring and operations require an admin account.
          </p>
          <div className="adm-actions" style={{ justifyContent: "center", gap: 12, marginTop: 20 }}>
            <Link className="btn btn-primary" href="/dashboard">
              Return to overview
            </Link>
            <Link className="btn btn-secondary" href="/">
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
