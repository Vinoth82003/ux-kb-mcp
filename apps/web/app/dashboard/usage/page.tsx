import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function UsagePage() {
  const store = await getStore();
  const usage = await store.listUsage(undefined, 100);
  return (
    <div>
      <h2>Recent usage</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
            <th style={{ padding: 8 }}>Time</th>
            <th style={{ padding: 8 }}>Tool</th>
            <th style={{ padding: 8 }}>OK</th>
            <th style={{ padding: 8 }}>Latency</th>
          </tr>
        </thead>
        <tbody>
          {usage.map((u) => (
            <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: 8 }}>{new Date(u.createdAt).toLocaleString()}</td>
              <td style={{ padding: 8 }}>
                <code>{u.tool}</code>
              </td>
              <td style={{ padding: 8 }}>{u.ok ? "yes" : "no"}</td>
              <td style={{ padding: 8 }}>{u.latencyMs}ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
