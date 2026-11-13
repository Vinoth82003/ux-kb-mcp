import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="container" style={{ padding: "32px 0" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>UX-KB admin</p>
          <h1 style={{ margin: "4px 0 0", fontSize: "1.6rem" }}>Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{session?.user?.email}</span>
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
      <nav style={{ display: "flex", gap: 16, marginBottom: 32, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/keys">API keys</Link>
        <Link href="/dashboard/usage">Usage</Link>
        <Link href="/dashboard/gaps">Gaps</Link>
        <Link href="/dashboard/releases">Releases</Link>
      </nav>
      {children}
    </div>
  );
}
