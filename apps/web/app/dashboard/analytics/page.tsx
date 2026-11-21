import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";
import PageHeader from "../page-header";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  await requireUser();
  const store = await getStore();
  const usage = await store.listUsage(undefined, 500);

  const byTool = new Map<string, { count: number; latency: number; errors: number }>();
  for (const entry of usage) {
    const row = byTool.get(entry.tool) ?? { count: 0, latency: 0, errors: 0 };
    row.count += 1;
    row.latency += entry.latencyMs;
    if (!entry.ok) row.errors += 1;
    byTool.set(entry.tool, row);
  }
  const rows = [...byTool.entries()].sort((a, b) => b[1].count - a[1].count);
  const totalCalls = usage.length;
  const totalErrors = usage.filter((entry) => !entry.ok).length;
  const avgLatency = totalCalls
    ? Math.round(usage.reduce((sum, entry) => sum + entry.latencyMs, 0) / totalCalls)
    : 0;
  const peak = rows[0]?.[1].count ?? 0;

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Analytics"
        description="Aggregate, anonymous tool usage across the knowledge base. No feature text or evidence content is stored."
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{totalCalls}</span>
          <span className="adm-stat-label">Calls sampled</span>
          <span className="adm-stat-hint">most recent 500</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{rows.length}</span>
          <span className="adm-stat-label">Tools used</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{avgLatency}ms</span>
          <span className="adm-stat-label">Avg latency</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{totalErrors}</span>
          <span className="adm-stat-label">Errors</span>
          <span className="adm-stat-hint">
            {totalCalls ? Math.round((totalErrors / totalCalls) * 100) : 0}% of calls
          </span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="adm-empty">
          <strong>No usage recorded</strong>
          <p>Calls appear here after an agent authenticates with an API key.</p>
        </div>
      ) : (
        <>
          <div className="adm-card" style={{ marginBottom: 16 }} aria-hidden="true">
            <h2 className="adm-section-title">Calls by tool</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rows.map(([tool, row]) => (
                <div key={tool} className="adm-inline" style={{ gap: 10 }}>
                  <code className="adm-code" style={{ minWidth: 190 }}>{tool}</code>
                  <span
                    style={{
                      display: "inline-block",
                      height: 12,
                      width: `${Math.max(6, Math.round((row.count / peak) * 100))}%`,
                      maxWidth: "60%",
                      borderRadius: 6,
                      background: "var(--action-primary)",
                    }}
                  />
                  <span className="adm-muted adm-small">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <caption className="sr-only">Tool usage counts and latency (table view of the chart)</caption>
              <thead>
                <tr>
                  <th scope="col">Tool</th>
                  <th scope="col">Calls</th>
                  <th scope="col">Errors</th>
                  <th scope="col">Avg latency (ms)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([tool, row]) => (
                  <tr key={tool}>
                    <td><code className="adm-code">{tool}</code></td>
                    <td>{row.count}</td>
                    <td>{row.errors}</td>
                    <td>{Math.round(row.latency / row.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
