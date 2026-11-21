"use client";

import { useEffect, useState } from "react";
import { sanitizeContent } from "@ux-kb/core/sanitizer";

export default function EditorClient({ id, initialBody }: { id: string; initialBody: string }) {
  const [body, setBody] = useState(initialBody);
  const [findings, setFindings] = useState<ReturnType<typeof sanitizeContent>["findings"]>([]);
  const [tokenCost, setTokenCost] = useState<{ full: number; rules: number; checks: number } | null>(null);

  useEffect(() => {
    setFindings(sanitizeContent(body).findings);
  }, [body]);

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!body.trim()) { setTokenCost(null); return; }
      try {
        const res = await fetch("/api/content/token-cost", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ markdown: body }),
        });
        const data = await res.json();
        if (res.ok) setTokenCost(data.tokenCost);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [body]);

  const tokenEstimate = Math.ceil(body.length / 4);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Edit {id}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: 4 }}>Body (markdown)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={24}
            style={{ width: "100%", fontFamily: "monospace", padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
          />
        </div>
        <div>
          <div style={{ padding: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, marginBottom: 12 }}>
            <strong>Token cost (server):</strong>{" "}
            {tokenCost ? `full ${tokenCost.full} · rules ${tokenCost.rules} · checks ${tokenCost.checks}` : "—"}
            {tokenCost && tokenCost.full > 900 && (
              <span style={{ color: "#f87171", marginLeft: 8 }}>⚠ exceeds 900 target</span>
            )}
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>
              chars/4 estimate: {tokenEstimate}
            </div>
          </div>
          <div style={{ padding: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <strong>Sanitizer findings:</strong> {findings.length === 0 ? "none" : findings.length}
            {findings.map((f, i) => (
              <div key={i} style={{ marginTop: 6, fontSize: "0.85rem", color: "#f87171" }}>
                {f.code}: {f.match}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <strong>Preview</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.8rem", marginTop: 8 }}>{body}</pre>
          </div>
        </div>
      </div>
      <p style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--muted)" }}>
        Draft save / publish wired in M3 (review & release). Editor keystroke-to-preview target ≤ 150 ms.
      </p>
    </div>
  );
}
