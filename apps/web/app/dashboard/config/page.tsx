"use client";

import { useState } from "react";
import { sanitizeContent } from "@ux-kb/core/sanitizer";

export default function ConfigPage() {
  const [text, setText] = useState("");
  const [findings, setFindings] = useState<ReturnType<typeof sanitizeContent>["findings"]>([]);

  function test() {
    setFindings(sanitizeContent(text).findings);
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Configuration</h2>
      <h3>Modes and budgets (defaults)</h3>
      <ul>
        <li>quick: session 3,000 · stage packs disabled</li>
        <li>audit: session 8,000 · packs audit+critique · cap 2,500</li>
        <li>full: session 30,000 · all packs · cap 4,000</li>
      </ul>
      <h3 style={{ marginTop: 24 }}>Sanitizer tester</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        style={{ width: "100%", fontFamily: "monospace", padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
      />
      <button className="btn btn-primary" onClick={test} style={{ marginTop: 8 }}>Test</button>
      <div style={{ marginTop: 12 }}>
        {findings.length === 0 ? (
          <p style={{ color: "#4ade80" }}>No findings — content is clean.</p>
        ) : (
          findings.map((f, i) => (
            <div key={i} style={{ color: "#f87171", fontSize: "0.85rem" }}>
              {f.code}: {f.match}
            </div>
          ))
        )}
      </div>
      <h3 style={{ marginTop: 24 }}>Rate limits</h3>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
        Defaults: 60 calls/min, 600/hour per key. Editing wired in a future milestone.
      </p>
    </div>
  );
}
