import { KEY_LIMITS } from "@ux-kb/core";
import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";
import CreateKeyForm from "./create-key-form";
import KeyActions from "./key-actions";

export const dynamic = "force-dynamic";

function statusOf(key: {
  revokedAt: Date | null;
  expiresAt: Date | null;
}): { label: string; tone: string } {
  if (key.revokedAt) return { label: "revoked", tone: "#f87171" };
  if (key.expiresAt && key.expiresAt.getTime() <= Date.now()) {
    return { label: "expired", tone: "#fbbf24" };
  }
  return { label: "active", tone: "#4ade80" };
}

export default async function KeysPage() {
  const user = await requireUser();
  const store = await getStore();
  const keys = await store.listKeysByOwner(user.id);
  const limits = KEY_LIMITS[user.role];
  const activeCount = keys.filter((key) => !key.revokedAt).length;

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>API keys</h2>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        {activeCount} of {limits.maxActiveKeys} active keys. Keys are shown once
        and stored only as an HMAC-SHA256 hash.
      </p>

      <CreateKeyForm
        maxRateLimit={limits.maxRateLimit}
        defaultRateLimit={limits.defaultRateLimit}
        isAdmin={user.role === "ADMIN"}
      />

      <div style={{ overflowX: "auto", marginTop: 28 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: 8 }}>Name</th>
              <th style={{ padding: 8 }}>Key</th>
              <th style={{ padding: 8 }}>Rate</th>
              <th style={{ padding: 8 }}>Expires</th>
              <th style={{ padding: 8 }}>Last used</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 16, color: "var(--muted)" }}>
                  No keys yet. Create one above to connect an agent.
                </td>
              </tr>
            )}
            {keys.map((key) => {
              const status = statusOf(key);
              return (
                <tr key={key.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: 8 }}>{key.name}</td>
                  <td style={{ padding: 8 }}>
                    <code>{key.prefix || "—"}…</code>
                  </td>
                  <td style={{ padding: 8 }}>{key.rateLimit}/min</td>
                  <td style={{ padding: 8 }}>
                    {key.expiresAt ? key.expiresAt.toLocaleDateString() : "never"}
                  </td>
                  <td style={{ padding: 8 }}>
                    {key.lastUsedAt ? key.lastUsedAt.toLocaleString() : "never"}
                  </td>
                  <td style={{ padding: 8, color: status.tone }}>{status.label}</td>
                  <td style={{ padding: 8 }}>
                    {!key.revokedAt && <KeyActions id={key.id} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 20, fontSize: "0.85rem", color: "var(--muted)" }}>
        Revocation is immediate. Rotation issues a replacement and revokes the
        old key in the same step.
      </p>
    </div>
  );
}
