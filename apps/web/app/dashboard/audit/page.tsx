import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; actor?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const store = await getStore();
  const entries = await store.listAudit(500);
  const filtered = entries.filter((e) => {
    if (params.action && !e.action.includes(params.action)) return false;
    if (params.actor && !e.actor.includes(params.actor)) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ marginTop: 0 }}>Audit log</h2>
        <Link href="/api/audit/export" className="btn btn-ghost">Export JSON</Link>
      </div>
      <form method="get" style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input name="action" defaultValue={params.action ?? ""} placeholder="action contains" style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }} />
        <input name="actor" defaultValue={params.actor ?? ""} placeholder="actor contains" style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }} />
        <button type="submit" className="btn btn-ghost">Filter</button>
      </form>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Append-only. {filtered.length} of {entries.length} entries.
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 16, color: "var(--muted)" }}>
                  No audit entries.
                </td>
              </tr>
            )}
            {filtered.map((e) => (
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
