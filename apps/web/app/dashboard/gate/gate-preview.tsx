"use client";

import { useState } from "react";

const SCREEN_TYPES = ["list", "detail", "form", "dashboard", "settings", "auth", "empty-state", "other"];
const COMPONENTS = ["button", "table", "input", "modal", "navigation", "card", "tooltip", "notification", "dropdown"];

interface GateItem {
  id: string;
  check: string;
  severity: string;
  verify?: { hint?: string };
}

interface GateResult {
  counts?: { total: number; blocker: number; major: number; minor: number };
  items?: GateItem[];
  estimatedTokens?: number;
  error?: string;
}

export default function GatePreview() {
  const [screenType, setScreenType] = useState("list");
  const [components, setComponents] = useState<string[]>(["button", "table"]);
  const [result, setResult] = useState<GateResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(component: string) {
    setComponents((prev) =>
      prev.includes(component) ? prev.filter((item) => item !== component) : [...prev, component],
    );
  }

  async function run(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/gate/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ screenType, components, screen: "Preview" }),
      });
      const data = (await response.json()) as GateResult;
      if (!response.ok) throw new Error(data?.error ?? "Preview failed.");
      setResult(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setPending(false);
    }
  }

  const overBudget = (result?.estimatedTokens ?? 0) > 1200;

  return (
    <div className="adm-card">
      <form onSubmit={run}>
        <div className="adm-toolbar" style={{ marginBottom: 10 }}>
          <label className="adm-field">
            <span className="adm-label">Screen type</span>
            <select
              className="adm-select"
              value={screenType}
              onChange={(event) => setScreenType(event.target.value)}
            >
              {SCREEN_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Running…" : "Preview gate"}
          </button>
        </div>

        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="adm-label" style={{ marginBottom: 6 }}>Components on screen</legend>
          <div className="adm-inline">
            {COMPONENTS.map((component) => (
              <label key={component} className="adm-checkbox">
                <input
                  type="checkbox"
                  checked={components.includes(component)}
                  onChange={() => toggle(component)}
                />
                {component}
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      {error && (
        <p role="alert" className="adm-alert adm-alert-error" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}

      {pending && !result && (
        <div className="adm-stack" style={{ gap: 8, marginTop: 14 }}>
          <div className="adm-skeleton" style={{ height: 16, width: "45%" }} />
          <div className="adm-skeleton" style={{ height: 120 }} />
        </div>
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          <div className="adm-stats" style={{ marginBottom: 14 }}>
            <div className="adm-stat">
              <span className="adm-stat-value">{result.counts?.total ?? result.items?.length ?? 0}</span>
              <span className="adm-stat-label">Items</span>
            </div>
            <div className="adm-stat">
              <span className="adm-stat-value">{result.counts?.blocker ?? 0}</span>
              <span className="adm-stat-label">Blockers</span>
            </div>
            <div className="adm-stat">
              <span className="adm-stat-value">{result.counts?.major ?? 0}</span>
              <span className="adm-stat-label">Major</span>
            </div>
            <div className="adm-stat">
              <span className="adm-stat-value">{result.estimatedTokens ?? "—"}</span>
              <span className="adm-stat-label">Est. tokens</span>
              <span className="adm-stat-hint">{overBudget ? "over the 1,200 target" : "within target"}</span>
            </div>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <caption className="sr-only">Previewed gate items</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Check</th>
                  <th scope="col">Severity</th>
                  <th scope="col">Verify hint</th>
                </tr>
              </thead>
              <tbody>
                {(result.items ?? []).map((item) => (
                  <tr key={item.id}>
                    <td><code className="adm-code">{item.id}</code></td>
                    <td>{item.check}</td>
                    <td>
                      <span
                        className={`adm-badge ${item.severity === "blocker" ? "adm-badge-danger" : item.severity === "major" ? "adm-badge-warning" : "adm-badge-neutral"}`}
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td className={item.verify?.hint ? "adm-muted" : "adm-muted"}>
                      {item.verify?.hint ?? "—"}
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
