import { getKb } from "@/lib/kb";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const kb = getKb();
  const store = await getStore();
  const keys = await store.listKeys();
  const gaps = await store.listGaps();
  const usage = await store.listUsage(undefined, 50);
  return (
    <div className="stat-grid">
      <div className="stat">
        <strong>{kb.docs().length}</strong>
        <span>docs</span>
      </div>
      <div className="stat">
        <strong>{kb.version}</strong>
        <span>KB version</span>
      </div>
      <div className="stat">
        <strong>{keys.filter((k) => !k.revokedAt).length}</strong>
        <span>active keys</span>
      </div>
      <div className="stat">
        <strong>{gaps.length}</strong>
        <span>gaps</span>
      </div>
      <div className="stat">
        <strong>{usage.length}</strong>
        <span>recent calls</span>
      </div>
    </div>
  );
}
