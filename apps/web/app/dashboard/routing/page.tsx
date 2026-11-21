import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import PageHeader from "../page-header";
import RouteTester from "./route-tester";

export const dynamic = "force-dynamic";

export default async function RoutingPage() {
  await requireUser();
  const kb = getKb();
  const routes = kb.repo.routes();
  const coveredTags = new Set(routes.flatMap((route) => route.match));

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge"
        title="Routing"
        description="Feature text is matched against these tag rules, then additional documents are appended to the retrieval set. The tester calls the same router the MCP server uses."
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{routes.length}</span>
          <span className="adm-stat-label">Routing rules</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{coveredTags.size}</span>
          <span className="adm-stat-label">Matched tags</span>
        </div>
      </div>

      {routes.length === 0 ? (
        <div className="adm-empty">
          <strong>No routing rules</strong>
          <p>Add rules to the content tree so feature text can pull in extra docs.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Routing rules and the documents they add</caption>
            <thead>
              <tr>
                <th scope="col">Match tags</th>
                <th scope="col">Adds documents</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, index) => (
                <tr key={`${route.match.join("-")}-${index}`}>
                  <td>
                    <span className="adm-inline">
                      {route.match.map((tag) => (
                        <span key={tag} className="adm-badge adm-badge-neutral">{tag}</span>
                      ))}
                    </span>
                  </td>
                  <td>
                    <span className="adm-inline">
                      {route.add.map((id) => (
                        <code key={id} className="adm-code">{id}</code>
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="adm-section" aria-labelledby="tester-title">
        <div className="adm-section-head">
          <h2 id="tester-title" className="adm-section-title">
            Route tester
          </h2>
          <span className="adm-help">Nothing is stored</span>
        </div>
        <RouteTester />
      </section>
    </div>
  );
}
