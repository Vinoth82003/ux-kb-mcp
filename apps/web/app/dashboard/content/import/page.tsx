"use client";

import { useState } from "react";

interface ImportReport {
  ok?: boolean;
  persisted?: boolean;
  error?: string;
  document?: { id?: string; title?: string; tokenCost?: { full?: number } };
  conversionReport?: {
    id: string;
    title: string;
    parsedSections: string[];
    checks: number;
    tokenCost?: { full?: number };
    sanitizerFindings: { code: string; match: string }[];
  };
}

export default function ImportPage() {
  const [markdown, setMarkdown] = useState("");
  const [report, setReport] = useState<ImportReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setReport(null);
    try {
      const response = await fetch("/api/content/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ markdown }),
      });
      const data = (await response.json()) as ImportReport;
      if (!response.ok) throw new Error(data?.error ?? "Import failed.");
      setReport(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setPending(false);
    }
  }

  const conversion = report?.conversionReport;

  return (
    <div>
      <header className="adm-page-head">
        <div className="adm-page-copy">
          <p className="adm-eyebrow">Knowledge · Import</p>
          <h1 className="adm-title">Convert v1 markdown</h1>
          <p className="adm-desc">
            Paste a v1 document. The server converts it to the v2 shape, runs the
            sanitizer, and reports what it parsed. This is a dry run: nothing is
            written to the content tree.
          </p>
        </div>
      </header>

      <div className="adm-grid adm-grid-2">
        <form className="adm-card" onSubmit={submit}>
          <label className="adm-field">
            <span className="adm-label">v1 markdown</span>
            <textarea
              className="adm-textarea"
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              rows={22}
              spellCheck={false}
              placeholder={"# CMP-001 — Button hierarchy\n\n## Rules\n..."}
            />
          </label>
          <div className="adm-actions" style={{ marginTop: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={pending || !markdown.trim()}>
              {pending ? "Converting…" : "Convert"}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setMarkdown("");
                setReport(null);
                setError(null);
              }}
              disabled={pending}
            >
              Clear
            </button>
          </div>
          {error && (
            <p role="alert" className="adm-alert adm-alert-error" style={{ marginTop: 12 }}>
              {error}
            </p>
          )}
        </form>

        <div className="adm-stack">
          <section className="adm-card" aria-labelledby="result-title">
            <h2 id="result-title" className="adm-section-title">
              Conversion report
            </h2>
            {!conversion ? (
              <p className="adm-help" style={{ margin: 0 }}>
                Run a conversion to see the parsed id, title, sections, checks, token
                cost, and sanitizer findings.
              </p>
            ) : (
              <div className="adm-stack" style={{ gap: 12 }}>
                <dl className="adm-kv">
                  <dt>Document</dt>
                  <dd><code className="adm-code">{conversion.id}</code></dd>
                  <dt>Title</dt>
                  <dd>{conversion.title}</dd>
                  <dt>Checks</dt>
                  <dd>{conversion.checks}</dd>
                  <dt>Token cost</dt>
                  <dd>{conversion.tokenCost?.full ?? "—"} full</dd>
                  <dt>Persisted</dt>
                  <dd>
                    <span className="adm-badge adm-badge-neutral">dry run</span>
                  </dd>
                </dl>
                <div>
                  <span className="adm-label">Parsed sections</span>
                  <div className="adm-inline" style={{ marginTop: 4 }}>
                    {conversion.parsedSections.length === 0 ? (
                      <span className="adm-muted adm-small">None detected</span>
                    ) : (
                      conversion.parsedSections.map((section) => (
                        <span key={section} className="adm-badge adm-badge-info">{section}</span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="adm-card" aria-labelledby="findings-title">
            <h2 id="findings-title" className="adm-section-title">
              Sanitizer
            </h2>
            {!conversion ? (
              <p className="adm-help" style={{ margin: 0 }}>No findings yet.</p>
            ) : conversion.sanitizerFindings.length === 0 ? (
              <p className="adm-alert adm-alert-success" style={{ margin: 0 }}>
                No disallowed content found.
              </p>
            ) : (
              <ul className="adm-alert adm-alert-error" style={{ margin: 0, paddingLeft: 30 }}>
                {conversion.sanitizerFindings.map((finding, index) => (
                  <li key={`${finding.code}-${index}`}>
                    <code className="adm-code">{finding.code}</code> {finding.match}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
