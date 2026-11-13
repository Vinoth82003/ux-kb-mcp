import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function GapsPage() {
  const store = await getStore();
  const gaps = await store.listGaps();
  return (
    <div>
      <h2>Reported gaps</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
            <th style={{ padding: 8 }}>Topic</th>
            <th style={{ padding: 8 }}>Count</th>
            <th style={{ padding: 8 }}>Resolved</th>
            <th style={{ padding: 8 }}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {gaps.map((g) => (
            <tr key={g.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: 8 }}>{g.topic}</td>
              <td style={{ padding: 8 }}>{g.count}</td>
              <td style={{ padding: 8 }}>{g.resolved ? "yes" : "no"}</td>
              <td style={{ padding: 8 }}>{new Date(g.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
