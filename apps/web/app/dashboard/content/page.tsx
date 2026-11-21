import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; domain?: string; status?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const kb = getKb();
  const q = (params.q ?? "").toLowerCase();
  const docs = kb.docs().filter((d) => {
    if (params.domain && d.frontMatter.domain !== params.domain) return false;
    if (params.status && d.frontMatter.status !== params.status) return false;
    if (q && !`${d.frontMatter.id} ${d.frontMatter.title} ${d.summary}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ marginTop: 0 }}>Documents</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/dashboard/content/new" className="btn btn-primary">New doc</Link>
          <Link href="/dashboard/content/import" className="btn btn-ghost">Import v1</Link>
        </div>
      </div>
      <form method="get" style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input name="q" defaultValue={params.q ?? ""} placeholder="Search id/title/summary" style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", minWidth: 240 }} />
        <select name="domain" defaultValue={params.domain ?? ""} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}>
          <option value="">All domains</option>
          {["ux","visual_design","components","interaction","responsive","accessibility","content_writing","saas","design_systems","evaluation"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select name="status" defaultValue={params.status ?? ""} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}>
          <option value="">All statuses</option>
          {["draft","reviewed","published","deprecated"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-ghost">Filter</button>
      </form>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: 8 }}>ID</th>
              <th style={{ padding: 8 }}>Title</th>
              <th style={{ padding: 8 }}>Domain</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Rev</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 16, color: "var(--muted)" }}>No documents.</td></tr>
            )}
            {docs.map((d) => (
              <tr key={d.frontMatter.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 8 }}><code>{d.frontMatter.id}</code></td>
                <td style={{ padding: 8 }}>{d.frontMatter.title}</td>
                <td style={{ padding: 8 }}>{d.frontMatter.domain}</td>
                <td style={{ padding: 8 }}>{d.frontMatter.status}</td>
                <td style={{ padding: 8 }}>{d.frontMatter.rev}</td>
                <td style={{ padding: 8 }}>
                  <Link href={`/dashboard/content/${d.frontMatter.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--muted)" }}>
        Showing {docs.length} of {kb.docs().length} docs.
      </p>
    </div>
  );
}
