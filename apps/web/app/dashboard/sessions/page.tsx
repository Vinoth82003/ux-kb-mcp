import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  await requireUser();
  const store = await getStore();
  const usage = await store.listUsage(undefined, 1000);
  const bySession = new Map<string, { calls: number; tokens: number }>();
  for (const u of usage) {
    const key = u.sessionId ?? "(none)";
    const e = bySession.get(key) ?? { calls: 0, tokens: 0 };
    e.calls += 1;
    bySession.set(key, e);
  }
  const rows = [...bySession.entries()];

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Sessions (anonymous)</h2>
      <p style={{ color: "var(--muted)" }}>No feature text or evidence content is stored.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
            <th style={{ padding: 8 }}>Session</th>
            <th style={{ padding: 8 }}>Calls</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={2} style={{ padding: 16, color: "var(--muted)" }}>No sessions.</td></tr>
          )}
          {rows.map(([sid, v]) => (
            <tr key={sid} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: 8 }}><code>{sid}</code></td>
              <td style={{ padding: 8 }}>{v.calls}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
