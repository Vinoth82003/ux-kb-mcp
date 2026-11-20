import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function GapsPage() {
  const user = await requireUser();
  const store = await getStore();
  const gaps = await store.listGaps(true);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Gaps inbox</h2>
      <p style={{ color: "var(--muted)" }}>{gaps.length} gap topics.</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: 8 }}>Topic</th>
              <th style={{ padding: 8 }}>Count</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>First seen</th>
              <th style={{ padding: 8 }}>Last seen</th>
            </tr>
          </thead>
          <tbody>
            {gaps.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 16, color: "var(--muted)" }}>No gaps reported.</td></tr>
            )}
            {gaps.map((g) => (
              <tr key={g.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 8 }}>{g.topic}</td>
                <td style={{ padding: 8 }}>{g.count}</td>
                <td style={{ padding: 8 }}>{g.resolved ? "covered" : "open"}</td>
                <td style={{ padding: 8 }}>{new Date(g.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: 8 }}>{new Date(g.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
