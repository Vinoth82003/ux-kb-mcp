"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { sanitizeContent } from "@ux-kb/core/sanitizer";

type CheckResult = { name: string; passed: boolean; detail?: string };
type TokenCost = { full: number; rules: number; checks: number };

const TEMPLATE = `## Summary
One sentence describing the rule and why it matters.

## MUST
1. A non-negotiable rule.
2. Another non-negotiable rule.

## SHOULD
1. A recommended practice with a clear trade-off.

## AVOID
1. A pattern that predictably fails users.

## DECIDE
- **Situation** → decision.

## STATES
- Resting
- Hover
- Focus
- Disabled
- Error

## CHECK
- [ ] Observable pass condition.
`;

export default function EditorClient({
  id,
  initialBody,
  isNew = false,
}: {
  id: string;
  initialBody: string;
  isNew?: boolean;
}) {
  const [body, setBody] = useState(initialBody);
  const [tokenCost, setTokenCost] = useState<TokenCost | null>(null);
  const [checks, setChecks] = useState<CheckResult[] | null>(null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const dirty = body !== initialBody;
  const findings = sanitizeContent(body).findings;

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!body.trim()) {
        setTokenCost(null);
        return;
      }
      try {
        const response = await fetch("/api/content/token-cost", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ markdown: body }),
        });
        const data = await response.json();
        if (response.ok) setTokenCost(data.tokenCost ?? null);
      } catch {
        /* the explicit Validate action surfaces errors */
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [body]);

  const validate = useCallback(async () => {
    if (!body.trim()) return;
    setValidating(true);
    setError(null);
    try {
      const response = await fetch("/api/content/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ markdown: body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Validation failed");
      setChecks(data.checks ?? []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setValidating(false);
    }
  }, [body]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void validate();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [validate]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Clipboard access was blocked by the browser.");
    }
  }

  function download() {
    const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${id}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const tokenEstimate = Math.ceil(body.length / 4);
  const overBudget = Boolean(tokenCost && tokenCost.full > 900);

  return (
    <div>
      <header className="adm-page-head">
        <div className="adm-page-copy">
          <p className="adm-eyebrow">{isNew ? "New document" : "Edit draft"}</p>
          <h1 className="adm-title">{id}</h1>
          <p className="adm-desc">
            Authoring is a dry run in this deployment: the content tree ships with
            the app, so validate and export the result instead of expecting a save.
          </p>
        </div>
        <div className="adm-actions">
          {dirty && <span className="adm-badge adm-badge-warning">Unsaved changes</span>}
          <button className="btn btn-primary" type="button" onClick={validate} disabled={validating || !body.trim()}>
            {validating ? "Validating…" : "Validate"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={copy} disabled={!body.trim()}>
            {copied ? "Copied" : "Copy"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={download} disabled={!body.trim()}>
            Download .md
          </button>
          {!isNew && (
            <Link className="btn btn-ghost" href={`/dashboard/content/${id}`}>
              View doc
            </Link>
          )}
        </div>
      </header>

      {error && (
        <div className="adm-alert adm-alert-error" role="alert" style={{ marginBottom: 12 }}>
          {error}
        </div>
      )}

      {checks && (
        <div className="adm-card" style={{ marginBottom: 16 }}>
          <div className="adm-section-head">
            <h2 className="adm-section-title">Validation</h2>
            <span className={`adm-badge ${checks.every((check) => check.passed) ? "adm-badge-success" : "adm-badge-danger"}`}>
              {checks.every((check) => check.passed) ? "passing" : "needs work"}
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {checks.map((check) => (
              <li key={check.name} style={{ marginBottom: 4 }}>
                <span className={`adm-badge ${check.passed ? "adm-badge-success" : "adm-badge-danger"}`}>
                  {check.passed ? "pass" : "fail"}
                </span>{" "}
                {check.name}
                {check.detail && <span className="adm-muted adm-small"> — {check.detail}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="adm-grid adm-grid-2">
        <div className="adm-card">
          <label className="adm-field">
            <span className="adm-label">Body (markdown)</span>
            <textarea
              className="adm-textarea"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={26}
              spellCheck={false}
              aria-describedby="editor-help"
            />
          </label>
          {isNew && !body.trim() && (
            <button
              className="btn btn-ghost"
              type="button"
              style={{ marginTop: 10 }}
              onClick={() => setBody(TEMPLATE)}
            >
              Insert document template
            </button>
          )}
          <p className="adm-help" id="editor-help" style={{ marginTop: 8 }}>
            {body.length.toLocaleString()} characters · Ctrl/⌘+S validates. Preview
            updates locally; token cost is computed by the server.
          </p>
        </div>

        <div className="adm-stack">
          <div className="adm-card">
            <h2 className="adm-section-title">Token cost</h2>
            {tokenCost ? (
              <>
                <p style={{ margin: "0 0 6px" }}>
                  <strong>{tokenCost.full}</strong> full · {tokenCost.rules} rules · {tokenCost.checks} checks
                </p>
                <span className={`adm-badge ${overBudget ? "adm-badge-danger" : "adm-badge-success"}`}>
                  {overBudget ? "over the 900-token target" : "within the 900-token target"}
                </span>
                <p className="adm-help" style={{ marginTop: 8 }}>
                  Rough chars/4 estimate: {tokenEstimate}. The server value is authoritative.
                </p>
              </>
            ) : (
              <p className="adm-help">Paste or type markdown to see the server cost.</p>
            )}
          </div>

          <div className="adm-card">
            <h2 className="adm-section-title">Sanitizer</h2>
            {findings.length === 0 ? (
              <p className="adm-help">No disallowed content found.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {findings.map((finding, index) => (
                  <li key={`${finding.code}-${index}`} style={{ color: "var(--error)", fontSize: "0.85rem" }}>
                    <code className="adm-code">{finding.code}</code> {finding.match}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="adm-card">
            <h2 className="adm-section-title">Preview</h2>
            <pre className="adm-pre" style={{ maxHeight: 320 }}>{body || "Nothing to preview yet."}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
