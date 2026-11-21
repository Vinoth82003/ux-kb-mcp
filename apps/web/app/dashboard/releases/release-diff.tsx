"use client";

import { useState } from "react";

interface DiffDoc {
  id: string;
  rev: number;
  etag: string;
  changed: boolean;
  checks: { id: string; text: string; severity: string }[];
}

interface DiffResult {
  fromVersion: string;
  toVersion: string;
  changed: boolean;
  docs: DiffDoc[];
  error?: string;
}

export default function ReleaseDiff() {
  const [since, setSince] = useState("1.0.0");
  const [ids, setIds] = useState("");
  const [result, setResult] = useState<DiffResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function run(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const query = new URLSearchParams({ since, ids: ids.trim() });
      const response = await fetch(`/api/releases/diff?${query.toString()}`);
      const data = (await response.json()) as DiffResult;
      if (!response.ok) throw new Error(data?.error ?? "Diff failed.");
      setResult(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setPending(false);
    }
  }

  const changedDocs = result?.docs.filter((doc) => doc.changed) ?? [];
  const unchangedDocs = result?.docs.filter((doc) => !doc.changed) ?? [];

  return (
    <div className="adm-card">
      <form onSubmit={run}>
        <div className="adm-toolbar" style={{ marginBottom: 0 }}>
          <label className="adm-field">
            <span className="adm-label">Since version</span>
            <input
              className="adm-input"
              value={since}
              onChange={(event) => setSince(event.target.value)}
              placeholder="1.0.0"
              style={{ width: 130 }}
            />
          </label>
          <label className="adm-field" style={{ flex: "1 1 320px" }}>
            <span className="adm-label">Document ids (comma separated)</span>
            <input
              className="adm-input"
              value={ids}
              onChange={(event) => setIds(event.target.value)}
              placeholder="CMP-001,CMP-002,UX-001"
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={pending || !ids.trim()}>
            {pending ? "Comparing…" : "Compare"}
          </button>
        </div>
      </form>

      {error && (
        <p role="alert" className="adm-alert adm-alert-error" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}

      {result && (
        <div className="adm-stack" style={{ gap: 12, marginTop: 14 }}>
          <div className="adm-inline">
            <span className="adm-badge adm-badge-neutral">
              {result.fromVersion} → {result.toVersion}
            </span>
            <span className={`adm-badge ${result.changed ? "adm-badge-warning" : "adm-badge-success"}`}>
              {result.changed ? "version changed" : "same version"}
            </span>
            <span className="adm-muted adm-small">
              {changedDocs.length} changed · {unchangedDocs.length} unchanged
            </span>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <caption className="sr-only">Documents compared against the earlier version</caption>
              <thead>
                <tr>
                  <th scope="col">Document</th>
                  <th scope="col">Rev</th>
                  <th scope="col">Changed</th>
                  <th scope="col">Checks</th>
                  <th scope="col">ETag</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((doc) => (
                  <tr key={doc.id}>
                    <td><code className="adm-code">{doc.id}</code></td>
                    <td>{doc.rev}</td>
                    <td>
                      <span className={`adm-badge ${doc.changed ? "adm-badge-warning" : "adm-badge-neutral"}`}>
                        {doc.changed ? "yes" : "no"}
                      </span>
                    </td>
                    <td>{doc.checks.length}</td>
                    <td>
                      <code className="adm-code" style={{ fontSize: "0.72rem" }}>
                        {doc.etag.slice(0, 16) || "—"}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
