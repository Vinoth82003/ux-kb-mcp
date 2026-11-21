"use client";

import { useState } from "react";

export default function RouteTester() {
  const [feature, setFeature] = useState("");
  const [result, setResult] = useState<any>(null);
  const [pending, setPending] = useState(false);

  async function run() {
    setPending(true);
    setResult(null);
    try {
      const res = await fetch("/api/routing/test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ feature }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : String(e) });
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <textarea
        value={feature}
        onChange={(e) => setFeature(e.target.value)}
        rows={4}
        placeholder="Paste a feature description"
        style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
      />
      <button className="btn btn-primary" onClick={run} disabled={pending || !feature.trim()} style={{ marginTop: 8 }}>
        {pending ? "Testing..." : "Test route"}
      </button>
      {result && (
        <pre style={{ marginTop: 12, padding: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, whiteSpace: "pre-wrap", fontSize: "0.85rem" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
