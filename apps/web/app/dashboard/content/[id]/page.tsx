import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import PageHeader from "../../page-header";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DocDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const kb = getKb();
  const doc = kb.doc(id.toUpperCase());
  if (!doc) notFound();
  const versioned = kb.versionedDoc(doc.frontMatter.id);
  const sections = versioned?.sections;
  const checks = versioned?.checks ?? [];
  const sources = versioned?.sources ?? [];
  const related = versioned?.related ?? [];

  return (
    <div>
      <PageHeader
        eyebrow={`${doc.frontMatter.domain.replace(/_/g, " ")} · ${doc.frontMatter.type}`}
        title={`${doc.frontMatter.id} — ${doc.frontMatter.title}`}
        description={doc.summary}
        actions={
          <>
            <Link className="btn btn-primary" href={`/dashboard/content/${doc.frontMatter.id}/edit`}>
              Edit
            </Link>
            <Link className="btn btn-ghost" href={`/dashboard/content/new?from=${doc.frontMatter.id}`}>
              Duplicate
            </Link>
            <a className="btn btn-ghost" href={`/api/content/export/${doc.frontMatter.id}?format=markdown`}>
              Export .md
            </a>
          </>
        }
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{doc.frontMatter.rev}</span>
          <span className="adm-stat-label">Revision</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{versioned?.tokenCost.full ?? doc.tokenEstimate}</span>
          <span className="adm-stat-label">Full token cost</span>
          <span className="adm-stat-hint">
            rules {versioned?.tokenCost.rules ?? "—"} · checks {versioned?.tokenCost.checks ?? "—"}
          </span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{checks.length}</span>
          <span className="adm-stat-label">Checks</span>
          <span className="adm-stat-hint">
            {checks.filter((check) => check.severity === "blocker").length} blockers
          </span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{sources.length}</span>
          <span className="adm-stat-label">Sources</span>
          <span className="adm-stat-hint">{related.length} related docs</span>
        </div>
      </div>

      <div className="adm-grid adm-grid-2">
        <section className="adm-card" aria-labelledby="meta-title">
          <h2 id="meta-title" className="adm-section-title">Metadata</h2>
          <dl className="adm-kv">
            <dt>Status</dt>
            <dd>
              <span className={`adm-badge ${doc.frontMatter.status === "published" ? "adm-badge-success" : "adm-badge-warning"}`}>
                {doc.frontMatter.status}
              </span>
            </dd>
            <dt>Domain</dt>
            <dd>{doc.frontMatter.domain.replace(/_/g, " ")}</dd>
            <dt>Priority</dt>
            <dd>{doc.frontMatter.priority}</dd>
            <dt>Applies to</dt>
            <dd>{doc.frontMatter.applies_to.join(", ")}</dd>
            <dt>Stages</dt>
            <dd>{doc.frontMatter.stages.join(", ")}</dd>
            <dt>Updated</dt>
            <dd>{doc.frontMatter.updated}</dd>
            <dt>Tags</dt>
            <dd className="adm-inline">
              {doc.frontMatter.tags.map((tag) => (
                <span className="adm-badge adm-badge-neutral" key={tag}>{tag}</span>
              ))}
            </dd>
          </dl>
        </section>

        <section className="adm-card" aria-labelledby="sources-title">
          <h2 id="sources-title" className="adm-section-title">Sources</h2>
          {sources.length === 0 ? (
            <p className="adm-help">No sources recorded.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {sources.map((source) => (
                <li key={source.url} style={{ marginBottom: 8 }}>
                  <a href={source.url} target="_blank" rel="noreferrer noopener">
                    {source.title}
                  </a>
                  <span className="adm-muted adm-small"> · {source.relation}</span>
                </li>
              ))}
            </ul>
          )}
          <h3 className="adm-section-title" style={{ marginTop: 18 }}>Related</h3>
          {related.length === 0 ? (
            <p className="adm-help">No related documents.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {related.map((item) => (
                <li key={item.id} style={{ marginBottom: 6 }}>
                  <Link href={`/dashboard/content/${item.id}`}>{item.id}</Link>
                  {item.when && <span className="adm-muted adm-small"> — {item.when}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="adm-section" aria-labelledby="rules-title">
        <h2 id="rules-title" className="adm-section-title">Rules</h2>
        {!sections ? (
          <p className="adm-help">This document has no structured v2 sections.</p>
        ) : (
          <div className="adm-grid adm-grid-2">
            {([
              ["MUST", sections.MUST],
              ["SHOULD", sections.SHOULD],
              ["AVOID", sections.AVOID],
            ] as const).map(([label, rules]) =>
              rules.length === 0 ? null : (
                <div className="adm-card" key={label}>
                  <h3 className="adm-section-title">{label}</h3>
                  <ol style={{ margin: 0, paddingLeft: 20 }}>
                    {rules.map((rule) => (
                      <li key={rule.id} style={{ marginBottom: 6 }}>
                        <code className="adm-code">{rule.id}</code> {rule.text}
                      </li>
                    ))}
                  </ol>
                </div>
              ),
            )}
            {sections.DECIDE.length > 0 && (
              <div className="adm-card">
                <h3 className="adm-section-title">DECIDE</h3>
                <dl className="adm-kv" style={{ gridTemplateColumns: "1fr" }}>
                  {sections.DECIDE.map((item, index) => (
                    <div key={index}>
                      <dt>{item.situation}</dt>
                      <dd>{item.decision}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {sections.STATES.length > 0 && (
              <div className="adm-card">
                <h3 className="adm-section-title">STATES</h3>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {sections.STATES.map((state) => <li key={state}>{state}</li>)}
                </ul>
              </div>
            )}
            {sections.EXAMPLE && (sections.EXAMPLE.good || sections.EXAMPLE.bad) && (
              <div className="adm-card">
                <h3 className="adm-section-title">EXAMPLE</h3>
                {sections.EXAMPLE.good && <p><strong>Good:</strong> {sections.EXAMPLE.good}</p>}
                {sections.EXAMPLE.bad && <p><strong>Bad:</strong> {sections.EXAMPLE.bad}</p>}
              </div>
            )}
            {sections.FAILURE_MODES.length > 0 && (
              <div className="adm-card">
                <h3 className="adm-section-title">FAILURE MODES</h3>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {sections.FAILURE_MODES.map((mode) => <li key={mode}>{mode}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="adm-section" aria-labelledby="checks-title">
        <div className="adm-section-head">
          <h2 id="checks-title" className="adm-section-title">Checks</h2>
          <span className="adm-help">{checks.length} checks</span>
        </div>
        {checks.length === 0 ? (
          <div className="adm-empty">
            <strong>No checks</strong>
            <p>This document does not define verification checks.</p>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Check</th>
                  <th scope="col">Severity</th>
                  <th scope="col">WCAG</th>
                  <th scope="col">Verify hint</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((check) => (
                  <tr key={check.id}>
                    <td><code className="adm-code">{check.id}</code></td>
                    <td>
                      {check.text}
                      {check.naForbidden && <span className="adm-badge adm-badge-warning" style={{ marginLeft: 6 }}>N/A forbidden</span>}
                    </td>
                    <td>
                      <span className={`adm-badge ${check.severity === "blocker" ? "adm-badge-danger" : check.severity === "major" ? "adm-badge-warning" : "adm-badge-neutral"}`}>
                        {check.severity}
                      </span>
                    </td>
                    <td className="adm-muted">{check.wcag.length ? check.wcag.join(", ") : "—"}</td>
                    <td className={check.verify?.hint ? "" : "adm-muted"}>
                      {check.verify?.hint ?? "Missing hint"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <details className="adm-section">
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Raw markdown</summary>
        <pre className="adm-pre" style={{ marginTop: 10 }}>{doc.body}</pre>
      </details>
    </div>
  );
}
