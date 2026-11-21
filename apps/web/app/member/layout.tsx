import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/authz";
import MemberSidebar from "./sidebar";
import { signOutAction } from "@/app/dashboard/actions";

export const metadata = {
  title: { default: "Member — UX-KB", template: "%s — UX-KB" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/signin");
  if (user.role === "ADMIN") redirect("/dashboard");

  return (
    <div className="adm-shell">
      <MemberSidebar user={{ login: user.login, name: user.name, role: user.role }} signOut={signOutAction} />
      <div className="adm-main">
        <main id="main-content" className="adm-content">{children}</main>
      </div>
    </div>
  );
}
