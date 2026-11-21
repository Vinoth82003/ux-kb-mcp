import { getModePolicy } from "@ux-kb/core";
import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import PageHeader from "../page-header";
import ConfigTester from "./config-tester";

export const dynamic = "force-dynamic";

const MODES = ["quick", "audit", "full"] as const;

export default async function ConfigPage() {
  await requireUser();
  const kb = getKb();
  const policies = MODES.map((mode) => getModePolicy(mode));

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Configuration"
        description="Read-only view of the MCP mode policy plus a tester for the content sanitizer. Deployment-level values live in environment variables and the content tree."
      />

      <div className="adm-alert adm-alert-info" style={{ marginBottom: 16 }}>
        This deployment reads configuration from <code className="adm-code">content/</code> and
        the server environment. Editing here is disabled so a panel session cannot
        silently change what every agent receives.
      </div>

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{kb.version}</span>
          <span className="adm-stat-label">Content release</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{kb.docs().length}</span>
          <span className="adm-stat-label">Documents</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{kb.versionedDocs().length}</span>
          <span className="adm-stat-label">Versioned docs</span>
        </div>
      </div>

      <section aria-labelledby="modes-title">
        <h2 id="modes-title" className="adm-section-title">
          Mode policy
        </h2>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Session modes and their budgets</caption>
            <thead>
              <tr>
                <th scope="col">Mode</th>
                <th scope="col">Session budget</th>
                <th scope="col">Stage packs</th>
                <th scope="col">Critique</th>
                <th scope="col">Approval before code</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.mode}>
                  <td>
                    <code className="adm-code">{policy.mode}</code>
                  </td>
                  <td>{policy.budget.toLocaleString()} tokens</td>
                  <td className="adm-muted">
                    {policy.stagePack === "disabled"
                      ? "disabled"
                      : policy.stagePack === "all"
                        ? "all"
                        : policy.stagePack.stages.join(", ")}
                  </td>
                  <td className="adm-muted">{policy.critique}</td>
                  <td>{policy.approvalRequiredBeforeCode ? "required" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="adm-help" style={{ marginTop: 10 }}>
          Per-document budgets live with each document and are enforced by the pack
          builder, not by this panel.
        </p>
      </section>

      <section className="adm-section" aria-labelledby="sanitizer-title">
        <div className="adm-section-head">
          <h2 id="sanitizer-title" className="adm-section-title">
            Sanitizer tester
          </h2>
          <span className="adm-help">Runs locally in your browser</span>
        </div>
        <ConfigTester />
      </section>

      <section className="adm-section" aria-labelledby="limits-title">
        <h2 id="limits-title" className="adm-section-title">
          Rate limits
        </h2>
        <dl className="adm-kv">
          <dt>Per key</dt>
          <dd>60 calls/min · 600/hour by default; admins may raise the per-minute cap</dd>
          <dt>Daily</dt>
          <dd>10,000 calls per key</dd>
          <dt>Failure behaviour</dt>
          <dd>429 with a Retry-After header; usage is still logged</dd>
        </dl>
      </section>
    </div>
  );
}
