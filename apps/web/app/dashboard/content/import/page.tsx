"use client";

import { useState } from "react";

export default function ImportPage() {
  const [markdown, setMarkdown] = useState("");
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit() {
    setPending(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/api/content/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ markdown }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Import failed");
      setReport(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Import v1 markdown</h2>
      <p style={{ color: "var(--muted)" }}>Paste a v1 markdown doc. The server converts it to v2 JSON and reports what was parsed.</p>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        rows={18}
        style={{ width: "100%", fontFamily: "monospace", padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
      />
      <button className="btn btn-primary" onClick={submit} disabled={pending || !markdown.trim()} style={{ marginTop: 12 }}>
        {pending ? "Converting..." : "Convert"}
      </button>
      {error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}
      {report && (
        <pre style={{ marginTop: 16, padding: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, whiteSpace: "pre-wrap", fontSize: "0.85rem" }}>
          {JSON.stringify(report, null, 2)}
        </pre>
      )}
    </div>
  );
}
