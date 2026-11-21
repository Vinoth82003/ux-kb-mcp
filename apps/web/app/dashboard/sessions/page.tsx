import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";
import PageHeader from "../page-header";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  await requireUser();
  const store = await getStore();
  const usage = await store.listUsage(undefined, 1000);

  const bySession = new Map<string, { calls: number; tools: Set<string> }>();
  for (const entry of usage) {
    const key = entry.sessionId ?? "(none)";
    const row = bySession.get(key) ?? { calls: 0, tools: new Set<string>() };
    row.calls += 1;
    row.tools.add(entry.tool);
    bySession.set(key, row);
  }
  const rows = [...bySession.entries()].sort((a, b) => b[1].calls - a[1].calls);

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Sessions"
        description="Anonymous retrieval sessions, identified only by an opaque session id. Feature text and evidence are never stored."
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{rows.length}</span>
          <span className="adm-stat-label">Sessions</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{usage.length}</span>
          <span className="adm-stat-label">Calls sampled</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{rows[0]?.[1].calls ?? 0}</span>
          <span className="adm-stat-label">Busiest session</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="adm-empty">
          <strong>No sessions yet</strong>
          <p>Sessions appear after an agent calls <code className="adm-code">start_session</code>.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Sessions and their call counts</caption>
            <thead>
              <tr>
                <th scope="col">Session</th>
                <th scope="col">Calls</th>
                <th scope="col">Tools</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([sessionId, row]) => (
                <tr key={sessionId}>
                  <td><code className="adm-code">{sessionId}</code></td>
                  <td>{row.calls}</td>
                  <td className="adm-muted">{row.tools.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
