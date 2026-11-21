import { getStore } from "@/lib/store";
import { requireAdmin } from "@/lib/authz";
import PageHeader from "../page-header";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; actor?: string; target?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const store = await getStore();
  const entries = await store.listAudit(1000);
  const q = (value: string | undefined) => (value ?? "").trim().toLowerCase();
  const action = q(params.action);
  const actor = q(params.actor);
  const target = q(params.target);
  const filtered = entries.filter((entry) => {
    if (action && !entry.action.toLowerCase().includes(action)) return false;
    if (actor && !entry.actor.toLowerCase().includes(actor)) return false;
    if (target && !entry.target.toLowerCase().includes(target)) return false;
    return true;
  });
  const isFiltered = Boolean(action || actor || target);

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Audit log"
        description="Append-only record of sign-ins, mutations, exports, and denied access. Rows cannot be edited or deleted from the panel."
        actions={
          <a className="btn btn-ghost" href="/api/audit/export">
            Export JSON
          </a>
        }
      />

      <form method="get" className="adm-toolbar" role="search">
        <label className="adm-field" style={{ flex: "1 1 180px" }}>
          <span className="adm-label">Action contains</span>
          <input
            className="adm-input"
            name="action"
            defaultValue={params.action ?? ""}
            placeholder="key.rotate"
          />
        </label>
        <label className="adm-field" style={{ flex: "1 1 180px" }}>
          <span className="adm-label">Actor contains</span>
          <input
            className="adm-input"
            name="actor"
            defaultValue={params.actor ?? ""}
            placeholder="github:login"
          />
        </label>
        <label className="adm-field" style={{ flex: "1 1 180px" }}>
          <span className="adm-label">Target contains</span>
          <input
            className="adm-input"
            name="target"
            defaultValue={params.target ?? ""}
            placeholder="doc or key id"
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Filter
        </button>
        {isFiltered && (
          <Link className="btn btn-ghost" href="/dashboard/audit">
            Clear
          </Link>
        )}
      </form>

      <p className="adm-help" style={{ marginBottom: 10 }}>
        {filtered.length} of {entries.length} most recent entries.
      </p>

      {filtered.length === 0 ? (
        <div className="adm-empty">
          <strong>No matching entries</strong>
          <p>Widen the filters, or clear them to see every recorded event.</p>
          <Link className="btn btn-ghost" href="/dashboard/audit">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Audit events, newest first</caption>
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Actor</th>
                <th scope="col">Action</th>
                <th scope="col">Target</th>
                <th scope="col">IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id}>
                  <td className="adm-nowrap">{new Date(entry.createdAt).toLocaleString()}</td>
                  <td>{entry.actor}</td>
                  <td>
                    <code className="adm-code">{entry.action}</code>
                  </td>
                  <td className="adm-muted">{entry.target}</td>
                  <td className="adm-muted adm-nowrap">{entry.ip ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
