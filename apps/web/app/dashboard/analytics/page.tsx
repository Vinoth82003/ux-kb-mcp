import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  await requireUser();
  const store = await getStore();
  const usage = await store.listUsage(undefined, 500);
  const byTool = new Map<string, { count: number; latency: number }>();
  for (const u of usage) {
    const e = byTool.get(u.tool) ?? { count: 0, latency: 0 };
    e.count += 1;
    e.latency += u.latencyMs;
    byTool.set(u.tool, e);
  }
  const rows = [...byTool.entries()].sort((a, b) => b[1].count - a[1].count);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Analytics</h2>
      <p style={{ color: "var(--muted)" }}>Aggregate, anonymous. {usage.length} recent calls.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
            <th style={{ padding: 8 }}>Tool</th>
            <th style={{ padding: 8 }}>Calls</th>
            <th style={{ padding: 8 }}>Avg latency (ms)</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={3} style={{ padding: 16, color: "var(--muted)" }}>No usage recorded.</td></tr>
          )}
          {rows.map(([tool, v]) => (
            <tr key={tool} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: 8 }}><code>{tool}</code></td>
              <td style={{ padding: 8 }}>{v.count}</td>
              <td style={{ padding: 8 }}>{Math.round(v.latency / v.count)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
