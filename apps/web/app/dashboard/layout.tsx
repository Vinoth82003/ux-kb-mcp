import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/authz";
import AdminSidebar from "../dashboard/sidebar";
import { signOutAction } from "../dashboard/actions";

export const metadata = {
  title: { default: "Admin — UX-KB", template: "%s — UX-KB Admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/signin");
  if (user.role !== "ADMIN") redirect("/member");

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
