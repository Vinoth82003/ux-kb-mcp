import { getStore } from "@/lib/store";
import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function FalsePositivesPage() {
  await requireUser();
  const store = await getStore();
  const kb = getKb();
  const top = await (await import("@ux-kb/core")).topFailures(store, kb.repo, { window: "30d", limit: 20 });

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>False positives / noisy checks</h2>
      <p style={{ color: "var(--muted)" }}>Top failing checks in the last 30 days (aggregate, anonymous).</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: 8 }}>Item</th>
              <th style={{ padding: 8 }}>Failures</th>
              <th style={{ padding: 8 }}>Total</th>
              <th style={{ padding: 8 }}>Fail rate</th>
            </tr>
          </thead>
          <tbody>
            {top.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 16, color: "var(--muted)" }}>No failures recorded.</td></tr>
            )}
            {top.map((t) => (
              <tr key={t.itemId} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 8 }}><code>{t.itemId}</code></td>
                <td style={{ padding: 8 }}>{t.failures}</td>
                <td style={{ padding: 8 }}>{t.total}</td>
                <td style={{ padding: 8 }}>{(t.failRate * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
