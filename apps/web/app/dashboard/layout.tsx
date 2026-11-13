import Link from "next/link";
import { signOut } from "@/auth";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="container" style={{ padding: "32px 0" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>
            UX-KB dashboard
          </p>
          <h1 style={{ margin: "4px 0 0", fontSize: "1.6rem" }}>
            {user.name ?? user.login}
          </h1>
          <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            github:{user.login}
            {isAdmin ? " · admin" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link className="btn btn-ghost" href="/">
            Public site
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="btn btn-ghost" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <nav
        aria-label="Dashboard"
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 32,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/keys">API keys</Link>
        <Link href="/dashboard/usage">Usage</Link>
        <Link href="/dashboard/releases">Releases</Link>
        {isAdmin && <Link href="/dashboard/users">Users</Link>}
        {isAdmin && <Link href="/dashboard/gaps">Gaps</Link>}
      </nav>

      {children}
    </div>
  );
}
