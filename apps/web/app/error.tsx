"use client";

import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
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
          <p className="eyebrow" style={{ marginTop: 16 }}>500 Error</p>
          <h1 className="signin-title" style={{ fontSize: "1.75rem" }}>
            Something went wrong
          </h1>
          <p className="signin-subtitle" style={{ color: "var(--text-secondary)" }}>
            {error?.message ?? "An unexpected error occurred while loading this view."}
          </p>
          <div className="adm-actions" style={{ justifyContent: "center", gap: 12, marginTop: 20 }}>
            <button className="btn btn-primary" onClick={() => reset()} type="button">
              Try again
            </button>
            <Link className="btn btn-secondary" href="/dashboard">
              Go to dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
