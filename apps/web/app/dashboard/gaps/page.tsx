import { getStore } from "@/lib/store";
import { requireUser } from "@/lib/authz";
import { can } from "@/lib/policy";
import PageHeader from "../page-header";
import ResolveGapButton from "./resolve-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GapsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const showResolved = params.status === "resolved";
  const store = await getStore();
  const all = await store.listGaps(true);
  const open = all.filter((gap) => !gap.resolved);
  const resolved = all.filter((gap) => gap.resolved);
  const gaps = showResolved ? resolved : open;
  const writable = can(user, "doc.write");

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Gaps inbox"
        description="Topics agents asked about that the knowledge base could not answer. Counts are aggregated; the original feature text is never stored."
        actions={
          <>
            <Link
              className={`btn ${showResolved ? "btn-ghost" : "btn-primary"}`}
              href="/dashboard/gaps"
            >
              Open ({open.length})
            </Link>
            <Link
              className={`btn ${showResolved ? "btn-primary" : "btn-ghost"}`}
              href="/dashboard/gaps?status=resolved"
            >
              Covered ({resolved.length})
            </Link>
          </>
        }
      />

      {gaps.length === 0 ? (
        <div className="adm-empty">
          <strong>{showResolved ? "Nothing covered yet" : "No open gaps"}</strong>
          <p>
            {showResolved
              ? "Resolved topics will be listed here."
              : "Agents have not reported a missing topic in this window."}
          </p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Reported knowledge gaps</caption>
            <thead>
              <tr>
                <th scope="col">Topic</th>
                <th scope="col">Requests</th>
                <th scope="col">First seen</th>
                <th scope="col">Last seen</th>
                {!showResolved && <th scope="col">Action</th>}
              </tr>
            </thead>
            <tbody>
              {gaps.map((gap) => (
                <tr key={gap.id}>
                  <td>
                    <strong>{gap.topic}</strong>
                  </td>
                  <td>
                    <span className="adm-badge adm-badge-warning">{gap.count}</span>
                  </td>
                  <td className="adm-muted adm-nowrap">
                    {new Date(gap.createdAt).toLocaleDateString()}
                  </td>
                  <td className="adm-muted adm-nowrap">
                    {new Date(gap.updatedAt).toLocaleDateString()}
                  </td>
                  {!showResolved && (
                    <td>
                      {writable ? (
                        <ResolveGapButton id={gap.id} topic={gap.topic} />
                      ) : (
                        <span className="adm-muted adm-small">read-only</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
