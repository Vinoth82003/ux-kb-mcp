import type { Metadata } from "next";
import { requireUser } from "@/lib/authz";
import AdminSidebar from "./sidebar";
import { signOutAction } from "./actions";

export const metadata: Metadata = {
  title: {
    default: "Admin — UX-KB",
    template: "%s — UX-KB Admin",
  },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="adm-shell">
      <AdminSidebar
        user={{ login: user.login, name: user.name, role: user.role }}
        signOut={signOutAction}
      />
      <div className="adm-main">
        <main id="main-content" className="adm-content">
          {children}
        </main>
      </div>
    </div>
  );
}
