import Link from "next/link";
import { getKb } from "@/lib/kb";
import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const user = await requireUser();
  const kb = getKb();
  const store = await getStore();

  const [keys, usage] = await Promise.all([
    store.listKeysByOwner(user.id),
    store.listUsageByOwner(user.id, 200),
  ]);

  const active = keys.filter((key) => !key.revokedAt);
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const callsToday = usage.filter((entry) => entry.createdAt.getTime() >= since).length;
  const nextExpiry = active
    .map((key) => key.expiresAt)
    .filter((value): value is Date => value instanceof Date)
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return (
    <div>
      <div className="stat-grid">
        <div className="stat">
          <strong>{kb.docs().length}</strong>
          <span>docs available</span>
        </div>
        <div className="stat">
          <strong>{kb.version}</strong>
          <span>KB version</span>
        </div>
        <div className="stat">
          <strong>{active.length}</strong>
          <span>active keys</span>
        </div>
        <div className="stat">
          <strong>{callsToday}</strong>
          <span>calls in 24h</span>
        </div>
      </div>

      {active.length === 0 ? (
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Create your first API key</h2>
          <p style={{ color: "var(--muted)" }}>
            The key is shown once. Store it in your MCP client config and never
            commit it to a repository.
          </p>
          <Link className="btn btn-primary" href="/dashboard/keys">
            Create a key
          </Link>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Connect an agent</h2>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>
            Send the key as a Bearer token to the hosted MCP endpoint.
          </p>
          <pre style={{ margin: 0, overflowX: "auto" }}>
            <code>{`claude mcp add --transport http ux-kb https://ux-kb-site.vercel.app/api/mcp \\
  --header "Authorization: Bearer <your-key>"`}</code>
          </pre>
          {nextExpiry && (
            <p style={{ margin: "12px 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              Next key expiry: {nextExpiry.toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
