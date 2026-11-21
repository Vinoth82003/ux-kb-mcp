"use client";

import { useState } from "react";
import { sanitizeContent } from "@ux-kb/core/sanitizer";

export default function ConfigTester() {
  const [text, setText] = useState("");
  const [findings, setFindings] = useState<ReturnType<typeof sanitizeContent>["findings"] | null>(null);

  function test(event: React.FormEvent) {
    event.preventDefault();
    setFindings(sanitizeContent(text).findings);
  }

  return (
    <div className="adm-card">
      <form onSubmit={test}>
        <label className="adm-field">
          <span className="adm-label">Content to test</span>
          <textarea
            className="adm-textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={7}
            placeholder="Paste a document body, a tool response, or any text that will be served to an agent."
          />
        </label>
        <div className="adm-actions" style={{ marginTop: 10 }}>
          <button className="btn btn-primary" type="submit">
            Test content
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => {
              setText("");
              setFindings(null);
            }}
          >
            Clear
          </button>
        </div>
      </form>

      <div aria-live="polite" style={{ marginTop: 14 }}>
        {findings === null ? (
          <p className="adm-help" style={{ margin: 0 }}>
            Results appear here. No content leaves the browser.
          </p>
        ) : findings.length === 0 ? (
          <p className="adm-alert adm-alert-success" style={{ margin: 0 }}>
            No findings — this content is clean.
          </p>
        ) : (
          <div className="adm-alert adm-alert-error">
            <strong>{findings.length} finding{findings.length === 1 ? "" : "s"}</strong>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              {findings.map((finding, index) => (
                <li key={`${finding.code}-${index}`}>
                  <code className="adm-code">{finding.code}</code> {finding.match}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
