import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import PageHeader from "../page-header";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DOMAINS = [
  "ux",
  "visual_design",
  "components",
  "interaction",
  "responsive",
  "accessibility",
  "content_writing",
  "saas",
  "design_systems",
  "evaluation",
];
const STATUSES = ["draft", "reviewed", "published", "deprecated"];

function statusClass(status: string): string {
  switch (status) {
    case "published":
      return "adm-badge-success";
    case "reviewed":
      return "adm-badge-info";
    case "draft":
      return "adm-badge-warning";
    case "deprecated":
      return "adm-badge-danger";
    default:
      return "adm-badge-neutral";
  }
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; domain?: string; status?: string }>;
}) {
  await requireUser();
  const params = await searchParams;
  const kb = getKb();
  const all = kb.docs();
  const q = (params.q ?? "").trim().toLowerCase();
  const docs = all.filter((doc) => {
    if (params.domain && doc.frontMatter.domain !== params.domain) return false;
    if (params.status && doc.frontMatter.status !== params.status) return false;
    if (q) {
      const haystack = `${doc.frontMatter.id} ${doc.frontMatter.title} ${doc.summary}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
  const filtered = Boolean(q || params.domain || params.status);

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge"
        title="Documents"
        description="Every topic doc in the active release. Open a document to inspect rules, checks, sources, and token cost."
        actions={
          <>
            <Link className="btn btn-primary" href="/dashboard/content/new">
              New document
            </Link>
            <Link className="btn btn-ghost" href="/dashboard/content/import">
              Import v1
            </Link>
          </>
        }
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{all.length}</span>
          <span className="adm-stat-label">Total docs</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{all.filter((doc) => doc.frontMatter.status === "published").length}</span>
          <span className="adm-stat-label">Published</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{all.filter((doc) => doc.frontMatter.status !== "published").length}</span>
          <span className="adm-stat-label">Draft / reviewed</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{docs.length}</span>
          <span className="adm-stat-label">Matching filter</span>
        </div>
      </div>

      <form method="get" className="adm-toolbar" role="search">
        <label className="adm-field" style={{ flex: "1 1 260px" }}>
          <span className="adm-label">Search</span>
          <input
            className="adm-input"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="ID, title, or summary"
          />
        </label>
        <label className="adm-field">
          <span className="adm-label">Domain</span>
          <select className="adm-select" name="domain" defaultValue={params.domain ?? ""}>
            <option value="">All domains</option>
            {DOMAINS.map((domain) => (
              <option key={domain} value={domain}>{domain.replace(/_/g, " ")}</option>
            ))}
          </select>
        </label>
        <label className="adm-field">
          <span className="adm-label">Status</span>
          <select className="adm-select" name="status" defaultValue={params.status ?? ""}>
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn btn-primary">Filter</button>
        {filtered && (
          <Link className="btn btn-ghost" href="/dashboard/content">
            Clear
          </Link>
        )}
      </form>

      {docs.length === 0 ? (
        <div className="adm-empty">
          <strong>No documents match</strong>
          <p>Try a different status or domain, or clear the search.</p>
          <Link className="btn btn-ghost" href="/dashboard/content">Clear filters</Link>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Documents in the active release</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Domain</th>
                <th scope="col">Status</th>
                <th scope="col">Rev</th>
                <th scope="col">Tokens</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.frontMatter.id}>
                  <td><code className="adm-code">{doc.frontMatter.id}</code></td>
                  <td>
                    <Link href={`/dashboard/content/${doc.frontMatter.id}`}>
                      {doc.frontMatter.title}
                    </Link>
                  </td>
                  <td className="adm-muted">{doc.frontMatter.domain.replace(/_/g, " ")}</td>
                  <td>
                    <span className={`adm-badge ${statusClass(doc.frontMatter.status)}`}>
                      {doc.frontMatter.status}
                    </span>
                  </td>
                  <td>{doc.frontMatter.rev}</td>
                  <td className="adm-muted">{doc.tokenCost?.full ?? doc.tokenEstimate}</td>
                  <td>
                    <div className="adm-table-actions">
                      <Link href={`/dashboard/content/${doc.frontMatter.id}`}>View</Link>
                      <Link href={`/dashboard/content/${doc.frontMatter.id}/edit`}>Edit</Link>
                      <Link href={`/dashboard/content/new?from=${doc.frontMatter.id}`}>Duplicate</Link>
                      <a href={`/api/content/export/${doc.frontMatter.id}?format=markdown`}>Export</a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="adm-help" style={{ marginTop: 12 }}>
        Showing {docs.length} of {all.length} documents from release {kb.version}.
      </p>
    </div>
  );
}
