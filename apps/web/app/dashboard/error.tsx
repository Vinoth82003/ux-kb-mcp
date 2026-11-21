"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("dashboard.error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <div>
      <p className="adm-eyebrow">Something went wrong</p>
      <h1 className="adm-title">This screen could not load</h1>
      <p className="adm-desc">
        The admin API or database did not respond. Nothing was changed. You can
        retry, or return to the dashboard overview.
      </p>
      <div className="adm-alert adm-alert-error" role="alert" style={{ margin: "18px 0" }}>
        {error.message || "Unexpected error."}
        {error.digest ? <span className="adm-muted"> (ref {error.digest})</span> : null}
      </div>
      <div className="adm-actions">
        <button className="btn btn-primary" type="button" onClick={() => reset()}>
          Retry
        </button>
        <a className="btn btn-secondary" href="/dashboard">
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
