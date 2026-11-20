"use client";

import { useState } from "react";

const SCREEN_TYPES = ["list", "detail", "form", "dashboard", "settings", "auth", "empty-state", "other"];
const COMPONENTS = ["button", "table", "input", "modal", "navigation", "card", "tooltip", "notification", "dropdown"];

export default function GatePreview() {
  const [screenType, setScreenType] = useState("list");
  const [components, setComponents] = useState<string[]>(["button", "table"]);
  const [result, setResult] = useState<any>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(c: string) {
    setComponents((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function run() {
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/gate/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ screenType, components, screen: "Preview" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Preview failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <label>
          <span style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: 4 }}>Screen type</span>
          <select value={screenType} onChange={(e) => setScreenType(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}>
            {SCREEN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <div>
          <span style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: 4 }}>Components</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {COMPONENTS.map((c) => (
              <label key={c} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.85rem" }}>
                <input type="checkbox" checked={components.includes(c)} onChange={() => toggle(c)} />
                {c}
              </label>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" onClick={run} disabled={pending}>
          {pending ? "Running..." : "Preview gate"}
        </button>
      </div>
      {error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 16 }}>
          <p>
            <strong>Total:</strong> {result.counts?.total} · blocker {result.counts?.blocker} · major {result.counts?.major} · minor {result.counts?.minor}
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            Estimated tokens (target ≤ 1,200): {result.estimatedTokens}
          </p>
          <ul style={{ paddingLeft: 20 }}>
            {(result.items ?? []).map((it: any) => (
              <li key={it.id} style={{ marginBottom: 4 }}>
                <code>{it.id}</code> [{it.severity}] {it.check}
                {it.verify?.hint && <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}> — {it.verify.hint}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
