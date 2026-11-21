"use client";

import { useState } from "react";

interface RouteResult {
  feature?: string;
  tags?: string[];
  routedDocIds?: string[];
  matchedRules?: number;
  error?: string;
}

export default function RouteTester() {
  const [feature, setFeature] = useState("");
  const [result, setResult] = useState<RouteResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/routing/test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ feature }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Routing test failed.");
      setResult(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="adm-card">
      <form onSubmit={run}>
        <label className="adm-field">
          <span className="adm-label">Feature description</span>
          <textarea
            className="adm-textarea"
            value={feature}
            onChange={(event) => setFeature(event.target.value)}
            rows={4}
            placeholder="e.g. a checkout form with card fields, an order summary, and an error state"
          />
        </label>
        <div className="adm-actions" style={{ marginTop: 10 }}>
          <button className="btn btn-primary" type="submit" disabled={pending || !feature.trim()}>
            {pending ? "Testing…" : "Test route"}
          </button>
        </div>
      </form>

      {error && (
        <p role="alert" className="adm-alert adm-alert-error" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}

      {result && (
        <div className="adm-stack" style={{ gap: 10, marginTop: 14 }}>
          <p className="adm-help" style={{ margin: 0 }}>
            {result.matchedRules} rule{result.matchedRules === 1 ? "" : "s"} matched.
          </p>
          <div>
            <span className="adm-label">Matched tags</span>
            <div className="adm-inline" style={{ marginTop: 4 }}>
              {(result.tags ?? []).length === 0 ? (
                <span className="adm-muted adm-small">None</span>
              ) : (
                result.tags?.map((tag) => (
                  <span key={tag} className="adm-badge adm-badge-info">{tag}</span>
                ))
              )}
            </div>
          </div>
          <div>
            <span className="adm-label">Routed documents</span>
            <div className="adm-inline" style={{ marginTop: 4 }}>
              {(result.routedDocIds ?? []).length === 0 ? (
                <span className="adm-muted adm-small">No additional documents</span>
              ) : (
                result.routedDocIds?.map((id) => (
                  <code key={id} className="adm-code">{id}</code>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
