import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function UsagePage() {
  const user = await requireUser();
  const store = await getStore();
  const [usage, keys] = await Promise.all([
    store.listUsageByOwner(user.id, 100),
    store.listKeysByOwner(user.id),
  ]);
  const keyName = new Map(keys.map((key) => [key.id, key.name]));

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Recent usage</h2>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        The last 100 tool calls made with your keys.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: 8 }}>Time</th>
              <th style={{ padding: 8 }}>Key</th>
              <th style={{ padding: 8 }}>Tool</th>
              <th style={{ padding: 8 }}>OK</th>
              <th style={{ padding: 8 }}>Latency</th>
            </tr>
          </thead>
          <tbody>
            {usage.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 16, color: "var(--muted)" }}>
                  No calls yet. Connect an agent with one of your keys.
                </td>
              </tr>
            )}
            {usage.map((entry) => (
              <tr key={entry.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 8 }}>{entry.createdAt.toLocaleString()}</td>
                <td style={{ padding: 8 }}>{keyName.get(entry.apiKeyId) ?? "deleted key"}</td>
                <td style={{ padding: 8 }}>
                  <code>{entry.tool}</code>
                </td>
                <td style={{ padding: 8, color: entry.ok ? "#4ade80" : "#f87171" }}>
                  {entry.ok ? "yes" : "no"}
                </td>
                <td style={{ padding: 8 }}>{entry.latencyMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
