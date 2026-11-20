import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const user = await requireUser();
  const store = await getStore();
  const entries = await store.listAudit(200);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Audit log</h2>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Append-only. {entries.length} recent entries.
      </p>
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: 8 }}>When</th>
              <th style={{ padding: 8 }}>Actor</th>
              <th style={{ padding: 8 }}>Action</th>
              <th style={{ padding: 8 }}>Target</th>
              <th style={{ padding: 8 }}>IP</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 16, color: "var(--muted)" }}>
                  No audit entries yet.
                </td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 8 }}>{new Date(e.createdAt).toLocaleString()}</td>
                <td style={{ padding: 8 }}>{e.actor}</td>
                <td style={{ padding: 8 }}>{e.action}</td>
                <td style={{ padding: 8 }}>{e.target}</td>
                <td style={{ padding: 8 }}>{e.ip ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
