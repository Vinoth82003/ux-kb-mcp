import { KEY_LIMITS } from "@ux-kb/core";
import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";
import PageHeader from "../page-header";
import CreateKeyForm from "./create-key-form";
import KeyActions from "./key-actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

function statusOf(key: { revokedAt: Date | null; expiresAt: Date | null }): {
  label: string;
  tone: string;
} {
  if (key.revokedAt) return { label: "revoked", tone: "adm-badge-danger" };
  if (key.expiresAt && key.expiresAt.getTime() <= Date.now()) {
    return { label: "expired", tone: "adm-badge-warning" };
  }
  return { label: "active", tone: "adm-badge-success" };
}

export default async function KeysPage() {
  const user = await requireUser();
  const store = await getStore();
  const keys = await store.listKeysByOwner(user.id);
  const limits = KEY_LIMITS[user.role];
  const activeCount = keys.filter((key) => !key.revokedAt).length;

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="API keys"
        description="Credentials your MCP client sends as a Bearer token. Revocation is immediate; rotation issues a replacement and retires the old key in one step."
        actions={
          <Link className="btn btn-ghost" href="/dashboard/usage">
            View usage
          </Link>
        }
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{activeCount}</span>
          <span className="adm-stat-label">Active keys</span>
          <span className="adm-stat-hint">of {limits.maxActiveKeys} allowed</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{limits.maxRateLimit}</span>
          <span className="adm-stat-label">Max calls / min</span>
          <span className="adm-stat-hint">per key, by role</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{keys.length}</span>
          <span className="adm-stat-label">Issued</span>
          <span className="adm-stat-hint">includes revoked keys</span>
        </div>
      </div>

      <CreateKeyForm
        maxRateLimit={limits.maxRateLimit}
        defaultRateLimit={limits.defaultRateLimit}
        isAdmin={user.role === "ADMIN"}
        mfaEnabled={user.mfaEnabled}
      />

      <section className="adm-section" aria-labelledby="issued-title">
        <h2 id="issued-title" className="adm-section-title">
          Issued keys
        </h2>

        {keys.length === 0 ? (
          <div className="adm-empty">
            <strong>No keys yet</strong>
            <p>Create one above to connect an agent.</p>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <caption className="sr-only">Issued API keys and their status</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Key</th>
                  <th scope="col">Rate</th>
                  <th scope="col">Expires</th>
                  <th scope="col">Last used</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => {
                  const status = statusOf(key);
                  return (
                    <tr key={key.id}>
                      <td>{key.name}</td>
                      <td>
                        <code className="adm-code">{key.prefix || "—"}…</code>
                      </td>
                      <td className="adm-nowrap">{key.rateLimit}/min</td>
                      <td className="adm-nowrap">
                        {key.expiresAt ? key.expiresAt.toLocaleDateString() : "never"}
                      </td>
                      <td className="adm-nowrap">
                        {key.lastUsedAt ? key.lastUsedAt.toLocaleString() : "never"}
                      </td>
                      <td>
                        <span className={`adm-badge ${status.tone}`}>{status.label}</span>
                      </td>
                      <td>
                        {key.revokedAt ? (
                          <span className="adm-muted adm-small">
                            {key.revokedReason ?? "revoked"}
                          </span>
                        ) : (
                          <KeyActions id={key.id} name={key.name} mfaEnabled={user.mfaEnabled} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
