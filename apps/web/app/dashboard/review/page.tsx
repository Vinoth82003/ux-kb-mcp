import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import { can } from "@/lib/policy";
import PageHeader from "../page-header";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Finding {
  id: string;
  title: string;
  status: string;
  problems: { kind: string; detail: string }[];
}

export default async function ReviewPage() {
  const user = await requireUser();
  const kb = getKb();
  const docs = kb.versionedDocs();
  const publishable = can(user, "doc.publish");

  const findings: Finding[] = [];
  for (const doc of docs) {
    const problems: { kind: string; detail: string }[] = [];
    if (doc.status === "draft") {
      problems.push({ kind: "status", detail: "Draft has not been reviewed." });
    }
    if (doc.status === "deprecated") {
      problems.push({ kind: "status", detail: "Deprecated; exclude from the next release." });
    }
    const missingHints = doc.checks.filter(
      (check) =>
        (check.severity === "blocker" || check.severity === "major") && !check.verify?.hint,
    );
    if (missingHints.length > 0) {
      problems.push({
        kind: "verify",
        detail: `${missingHints.length} blocker/major check${missingHints.length === 1 ? "" : "s"} without a verify hint: ${missingHints
          .map((check) => check.id)
          .join(", ")}`,
      });
    }
    const missingWhen = doc.related.filter((related) => !related.when.trim());
    if (missingWhen.length > 0) {
      problems.push({
        kind: "related",
        detail: `${missingWhen.length} related link${missingWhen.length === 1 ? "" : "s"} without a “when” note`,
      });
    }
    if (problems.length > 0) {
      findings.push({ id: doc.id, title: doc.title, status: doc.status, problems });
    }
  }
  const blockers = findings.filter((finding) =>
    finding.problems.some((problem) => problem.kind === "verify" || problem.kind === "status"),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge"
        title="Review"
        description="Publishing requires a second person: the author of a change cannot approve it. Approval is disabled while a blocker or major check has no verify hint."
        actions={
          <span className="adm-badge adm-badge-info">
            {blockers.length} document{blockers.length === 1 ? "" : "s"} not ready
          </span>
        }
      />

      <div className="adm-grid adm-grid-2" style={{ marginBottom: 20 }}>
        <div className="adm-card">
          <h2 className="adm-section-title">Four-eyes rule</h2>
          <p className="adm-desc" style={{ marginBottom: 0 }}>
            The approve endpoint rejects a request when the signed-in reviewer is the
            author of the change request. It also requires the{" "}
            <code className="adm-code">doc.publish</code> capability, which members do
            not have.
          </p>
        </div>
        <div className="adm-card">
          <h2 className="adm-section-title">Automated gates</h2>
          <ul className="adm-doc-body" style={{ margin: 0, paddingLeft: 20 }}>
            <li>Schema validity and stable, immutable rule/check ids</li>
            <li>Content sanitizer (no evidence text, paths, or feature descriptions)</li>
            <li>Token budgets per document and per pack</li>
            <li>Verify hints on every blocker and major check</li>
          </ul>
        </div>
      </div>

      {findings.length === 0 ? (
        <div className="adm-empty">
          <strong>No pending changes</strong>
          <p>
            There are no unapproved change requests in this deployment, and every
            published document passes the automated gates.
          </p>
          <Link className="btn btn-ghost" href="/dashboard/content">
            Browse documents
          </Link>
        </div>
      ) : (
        <>
          <div className="adm-alert adm-alert-info" style={{ marginBottom: 14 }}>
            Change requests are not persisted in this deployment, so the queue is empty.
            The list below is the live content-readiness check the publish gate uses.
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <caption className="sr-only">Documents with outstanding review problems</caption>
              <thead>
                <tr>
                  <th scope="col">Document</th>
                  <th scope="col">Status</th>
                  <th scope="col">Why it is blocked</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((finding) => (
                  <tr key={finding.id}>
                    <td>
                      <code className="adm-code">{finding.id}</code>
                      <div className="adm-muted adm-small">{finding.title}</div>
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-neutral">{finding.status}</span>
                    </td>
                    <td>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {finding.problems.map((problem, index) => (
                          <li key={index} className="adm-small">
                            <span
                              className={`adm-badge ${problem.kind === "status" ? "adm-badge-warning" : "adm-badge-danger"}`}
                              style={{ marginRight: 6 }}
                            >
                              {problem.kind}
                            </span>
                            {problem.detail}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <Link href={`/dashboard/content/${finding.id}/edit`}>
                        {publishable ? "Fix and review" : "Inspect"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
