import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";
import PageHeader from "@/app/dashboard/page-header";

export const dynamic = "force-dynamic";

export default async function MemberUsagePage() {
  const user = await requireUser();
  const store = await getStore();
  const [usage, keys] = await Promise.all([
    store.listUsageByOwner(user.id, 100),
    store.listKeysByOwner(user.id),
  ]);
  const keyName = new Map(keys.map((key) => [key.id, key.name]));
  const failures = usage.filter((entry) => !entry.ok).length;

  return (
    <div>
      <PageHeader eyebrow="Account" title="Recent usage" description="The last 100 tool calls made with your keys." />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{usage.length}</span>
          <span className="adm-stat-label">Calls sampled</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{failures}</span>
          <span className="adm-stat-label">Failed</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{new Set(usage.map((entry) => entry.apiKeyId)).size}</span>
          <span className="adm-stat-label">Keys used</span>
        </div>
      </div>

      {usage.length === 0 ? (
        <div className="adm-empty">
          <strong>No calls yet</strong>
          <p>Connect an agent with one of your keys and calls will appear here.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Key</th>
                <th scope="col">Tool</th>
                <th scope="col">Result</th>
                <th scope="col">Latency</th>
              </tr>
            </thead>
            <tbody>
              {usage.map((entry) => (
                <tr key={entry.id}>
                  <td className="adm-nowrap">{entry.createdAt.toLocaleString()}</td>
                  <td>{keyName.get(entry.apiKeyId) ?? "deleted key"}</td>
                  <td><code className="adm-code">{entry.tool}</code></td>
                  <td>
                    <span className={`adm-badge ${entry.ok ? "adm-badge-success" : "adm-badge-danger"}`}>
                      {entry.ok ? "ok" : "error"}
                    </span>
                  </td>
                  <td className="adm-nowrap">{entry.latencyMs}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
