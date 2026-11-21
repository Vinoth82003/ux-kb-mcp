import { getStore } from "@/lib/store";
import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import { topFailures } from "@ux-kb/core";
import PageHeader from "../page-header";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FalsePositivesPage() {
  await requireUser();
  const store = await getStore();
  const kb = getKb();
  const top = await topFailures(store, kb.repo, { window: "30d", limit: 20 });
  const noisy = top.filter((row) => row.failures >= 3 && row.failRate >= 0.5);

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Noisy checks"
        description="Checks that fail most often in the last 30 days. A high failure rate can mean the check is wrong, the wording is ambiguous, or the verify hint is missing."
        actions={
          <Link className="btn btn-ghost" href="/dashboard/content">
            Open documents
          </Link>
        }
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{top.length}</span>
          <span className="adm-stat-label">Failing checks</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{noisy.length}</span>
          <span className="adm-stat-label">Candidates for review</span>
          <span className="adm-stat-hint">≥ 3 failures and ≥ 50% fail rate</span>
        </div>
      </div>

      {top.length === 0 ? (
        <div className="adm-empty">
          <strong>No failures recorded</strong>
          <p>Failures appear once agents submit compliance results.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Failure counts per check</caption>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Failures</th>
                <th scope="col">Total</th>
                <th scope="col">Fail rate</th>
                <th scope="col">Signal</th>
              </tr>
            </thead>
            <tbody>
              {top.map((row) => {
                const flagged = row.failures >= 3 && row.failRate >= 0.5;
                return (
                  <tr key={row.itemId}>
                    <td><code className="adm-code">{row.itemId}</code></td>
                    <td>{row.failures}</td>
                    <td>{row.total}</td>
                    <td>{Math.round(row.failRate * 100)}%</td>
                    <td>
                      <span className={`adm-badge ${flagged ? "adm-badge-warning" : "adm-badge-neutral"}`}>
                        {flagged ? "inspect" : "watch"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="adm-help" style={{ marginTop: 12 }}>
        Suppressing a check is a content change: edit its wording or verify hint in the
        document that owns the item. The panel does not store a separate suppression
        list, so the published rules stay the single source of truth.
      </p>
    </div>
  );
}
