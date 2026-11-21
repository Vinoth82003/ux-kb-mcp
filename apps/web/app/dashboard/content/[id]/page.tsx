import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DocDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const kb = getKb();
  const doc = kb.doc(id.toUpperCase());
  if (!doc) notFound();
  const vd = kb.versionedDoc(id.toUpperCase());

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ marginTop: 0 }}>{doc.frontMatter.id} — {doc.frontMatter.title}</h2>
        <Link href={`/dashboard/content/${doc.frontMatter.id}/edit`} className="btn btn-primary">Edit</Link>
      </div>
      <p style={{ color: "var(--muted)" }}>
        Domain: {doc.frontMatter.domain} · Status: {doc.frontMatter.status} · Rev: {doc.frontMatter.rev}
      </p>
      {vd && (
        <div style={{ margin: "12px 0", padding: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}>
          <strong>Token cost:</strong> full {vd.tokenCost.full} · rules {vd.tokenCost.rules} · checks {vd.tokenCost.checks}
        </div>
      )}
      <pre style={{ whiteSpace: "pre-wrap", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, fontSize: "0.85rem" }}>
        {doc.body}
      </pre>
    </div>
  );
}
