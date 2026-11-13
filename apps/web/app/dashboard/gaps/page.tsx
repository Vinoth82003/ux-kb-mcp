import { getStore } from "@/lib/store";
import { requireAdmin } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function GapsPage() {
  await requireAdmin();
  const store = await getStore();
  const gaps = await store.listGaps(true);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Reported gaps</h2>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Topics agents asked for that the knowledge base does not cover yet.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: 8 }}>Topic</th>
              <th style={{ padding: 8 }}>Count</th>
              <th style={{ padding: 8 }}>Resolved</th>
              <th style={{ padding: 8 }}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {gaps.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 16, color: "var(--muted)" }}>
                  No gaps reported.
                </td>
              </tr>
            )}
            {gaps.map((gap) => (
              <tr key={gap.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 8 }}>{gap.topic}</td>
                <td style={{ padding: 8 }}>{gap.count}</td>
                <td style={{ padding: 8 }}>{gap.resolved ? "yes" : "no"}</td>
                <td style={{ padding: 8 }}>{gap.updatedAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
