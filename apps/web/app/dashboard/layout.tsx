import Link from "next/link";
import { requireUser } from "@/lib/authz";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/content", label: "Content" },
  { href: "/dashboard/gate", label: "Core Gate" },
  { href: "/dashboard/review", label: "Review" },
  { href: "/dashboard/releases", label: "Releases" },
  { href: "/dashboard/gaps", label: "Gaps" },
  { href: "/dashboard/false-positives", label: "False positives" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/config", label: "Configuration" },
  { href: "/dashboard/keys", label: "API keys" },
  { href: "/dashboard/users", label: "Users & roles" },
  { href: "/dashboard/audit", label: "Audit log" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 220,
          borderRight: "1px solid var(--border)",
          padding: 16,
          background: "var(--surface)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 12 }}>UX-KB Admin</div>
        <nav aria-label="Admin navigation">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {NAV.map((item) => (
              <li key={item.href} style={{ marginBottom: 4 }}>
                <Link href={item.href} style={{ display: "block", padding: "6px 8px", borderRadius: 6 }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ marginTop: 16, fontSize: "0.8rem", color: "var(--muted)" }}>
          Signed in as {user.login} ({user.role})
        </div>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  );
}
