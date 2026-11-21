import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import { can } from "@/lib/policy";
import PageHeader from "../page-header";
import ReleaseActions from "./release-actions";
import ReleaseDiff from "./release-diff";

export const dynamic = "force-dynamic";

export default async function ReleasesPage() {
  const user = await requireUser();
  const kb = getKb();
  const release = kb.release();
  const docs = kb.docs();
  const versioned = kb.versionedDocs();
  const manageable = can(user, "release.manage");

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Releases"
        description="The content release served to every MCP client. Staging and promotion run outside the panel until a release backend is configured."
        actions={
          <span className="adm-badge adm-badge-success">
            {release.version} active
          </span>
        }
      />

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-value">{release.version}</span>
          <span className="adm-stat-label">Version</span>
          <span className="adm-stat-hint">{String(release.isActive)} active</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{docs.length}</span>
          <span className="adm-stat-label">Documents</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">{versioned.length}</span>
          <span className="adm-stat-label">Versioned</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-value">
            {docs.filter((doc) => doc.frontMatter.status === "published").length}
          </span>
          <span className="adm-stat-label">Published</span>
        </div>
      </div>

      <div className="adm-grid adm-grid-2">
        <section className="adm-card" aria-labelledby="active-title">
          <h2 id="active-title" className="adm-section-title">
            Active release
          </h2>
          <p className="adm-desc">{release.notes || "No release notes recorded."}</p>
          <dl className="adm-kv" style={{ marginTop: 12 }}>
            <dt>Version</dt>
            <dd><code className="adm-code">{release.version}</code></dd>
            <dt>Active</dt>
            <dd>{String(release.isActive)}</dd>
            <dt>Documents</dt>
            <dd>{docs.length}</dd>
          </dl>
          {manageable ? (
            <ReleaseActions
              enabled={process.env.RELEASES_ENABLED === "1"}
              mfaEnabled={user.mfaEnabled}
            />
          ) : (
            <p className="adm-alert adm-alert-info" style={{ marginTop: 14 }}>
              Your role can view releases but not stage, promote, or roll back. Ask an
              admin.
            </p>
          )}
        </section>

        <section className="adm-card" aria-labelledby="process-title">
          <h2 id="process-title" className="adm-section-title">
            How a release ships
          </h2>
          <ol className="adm-doc-body" style={{ margin: 0, paddingLeft: 20 }}>
            <li>Author edits land as drafts and pass schema, sanitizer, and verify-hint checks.</li>
            <li>A reviewer who is not the author approves (four-eyes rule).</li>
            <li>The content tree is deployed with an updated version marker.</li>
            <li>
              Clients pinned to an older version keep receiving it until they move to
              the new one.
            </li>
          </ol>
          <p className="adm-help" style={{ marginTop: 12 }}>
            The buttons are wired to an authorized endpoint, but return an explicit
            “not enabled” response rather than a fake success when no backend is
            configured.
          </p>
        </section>
      </div>

      {manageable && (
        <section className="adm-section" aria-labelledby="diff-title">
          <div className="adm-section-head">
            <h2 id="diff-title" className="adm-section-title">
              Release diff
            </h2>
            <span className="adm-help">Compares document ids against a prior version</span>
          </div>
          <ReleaseDiff />
        </section>
      )}
    </div>
  );
}
