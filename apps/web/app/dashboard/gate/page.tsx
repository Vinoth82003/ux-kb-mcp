import { coreScreenGateItems, screenTypeExtraItems } from "@ux-kb/core";
import { requireUser } from "@/lib/authz";
import PageHeader from "../page-header";
import GatePreview from "./gate-preview";

export const dynamic = "force-dynamic";

const SCREEN_TYPES = [
  "list",
  "detail",
  "form",
  "dashboard",
  "settings",
  "auth",
  "empty-state",
  "other",
] as const;

export default async function GatePage() {
  await requireUser();
  const items = coreScreenGateItems();
  const extras = SCREEN_TYPES.map((type) => ({ type, items: screenTypeExtraItems(type) }));

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge"
        title="Core screen gate"
        description="The baseline checklist every screen must satisfy. The preview runs the same gate builder as the MCP start_gate tool, so the item set and token estimate match production."
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{items.length}</span>
          <span className="adm-stat-label">Core items</span>
          <span className="adm-stat-hint">target ≤ 12</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{items.filter((item) => item.severity === "blocker").length}</span>
          <span className="adm-stat-label">Blockers</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">
            {items.filter((item) => item.severity === "major").length}
          </span>
          <span className="adm-stat-label">Major</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">
            {items.filter((item) => item.verify?.hint).length}/{items.length}
          </span>
          <span className="adm-stat-label">With verify hint</span>
        </div>
      </div>

      {items.length > 12 && (
        <p className="adm-alert adm-alert-warning" role="status" style={{ marginBottom: 16 }}>
          The core gate has {items.length} items, above the 12-item target. Prune or merge
          items before the next release.
        </p>
      )}

      <section aria-labelledby="core-items-title">
        <div className="adm-section-head">
          <h2 id="core-items-title" className="adm-section-title">
            Core items (SCR.*)
          </h2>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Core screen gate items</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Check</th>
                <th scope="col">Severity</th>
                <th scope="col">N/A forbidden</th>
                <th scope="col">Verify hint</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><code className="adm-code">{item.id}</code></td>
                  <td>{item.check}</td>
                  <td>
                    <span
                      className={`adm-badge ${item.severity === "blocker" ? "adm-badge-danger" : item.severity === "major" ? "adm-badge-warning" : "adm-badge-neutral"}`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td>{item.naForbidden ? "yes" : "—"}</td>
                  <td className={item.verify?.hint ? "" : "adm-muted"}>
                    {item.verify?.hint ?? "missing"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="adm-section" aria-labelledby="extras-title">
        <h2 id="extras-title" className="adm-section-title">
          Screen-type extras
        </h2>
        <div className="adm-grid adm-grid-3">
          {extras.map((extra) => (
            <div className="adm-card" key={extra.type}>
              <h3 className="adm-section-title" style={{ fontSize: "0.92rem" }}>
                {extra.type}
              </h3>
              {extra.items.length === 0 ? (
                <p className="adm-help" style={{ margin: 0 }}>No extra items.</p>
              ) : (
                <div className="adm-inline">
                  {extra.items.map((item) => (
                    <code key={item.id} className="adm-code">{item.id}</code>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="adm-section" aria-labelledby="preview-title">
        <div className="adm-section-head">
          <h2 id="preview-title" className="adm-section-title">
            Gate preview
          </h2>
          <span className="adm-help">No content is stored</span>
        </div>
        <GatePreview />
      </section>
    </div>
  );
}
