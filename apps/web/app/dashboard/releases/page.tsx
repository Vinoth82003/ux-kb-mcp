import { getKb } from "@/lib/kb";
import ReleaseActions from "./release-actions";

export const dynamic = "force-dynamic";

export default async function ReleasesPage() {
  const kb = getKb();
  const release = kb.release();
  return (
    <div>
      <h2>Releases</h2>
      <div className="card" style={{ maxWidth: 480 }}>
        <h3>{release.version}</h3>
        <p>{release.notes || "No release notes."}</p>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          Active: {String(release.isActive)} · {kb.docs().length} docs
        </p>
        <ReleaseActions />
      </div>
    </div>
  );
}
