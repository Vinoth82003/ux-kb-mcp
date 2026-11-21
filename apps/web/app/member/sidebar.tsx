"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/member", label: "Overview", icon: "overview" },
  { href: "/member/keys", label: "API keys", icon: "keys" },
  { href: "/member/usage", label: "Usage", icon: "analytics" },
  { href: "/member/security", label: "Security", icon: "security" },
];

function icon(name: string) {
  // Reuse a compact set; full icons live in the admin sidebar.
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "overview":
      return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
    case "keys":
      return <svg {...common}><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l3 3M14 9l3 3" /></svg>;
    case "analytics":
      return <svg {...common}><path d="M4 20V4" /><path d="M4 20h16" /><rect x="7" y="12" width="3" height="5" /><rect x="12" y="8" width="3" height="9" /><rect x="17" y="5" width="3" height="12" /></svg>;
    case "security":
      return <svg {...common}><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v2" /></svg>;
    default:
      return null;
  }
}

export default function MemberSidebar({
  user,
  signOut,
}: {
  user: { login: string; name: string | null; role: string };
  signOut: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const displayName = user.name?.trim() || user.login;
  const initials = displayName.slice(0, 2);

  return (
    <>
      <a className="adm-skip" href="#main-content">Skip to content</a>

      <div className="adm-topbar">
        <button className="adm-menu-button" type="button" aria-expanded={open} aria-controls="member-sidebar" onClick={() => setOpen((v) => !v)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          Menu
        </button>
        <Link href="/member" className="adm-brand" style={{ padding: 0, border: 0 }}>
          <span className="adm-brand-mark" aria-hidden="true">UX</span>
          <span className="adm-brand-copy"><span>UX-KB</span><span className="adm-brand-sub">Member portal</span></span>
        </Link>
      </div>

      <button type="button" className={`adm-backdrop ${open ? "is-open" : ""}`} aria-label="Close navigation" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />

      <aside id="member-sidebar" className={`adm-sidebar ${open ? "is-open" : ""}`}>
        <Link href="/member" className="adm-brand">
          <span className="adm-brand-mark" aria-hidden="true">UX</span>
          <span className="adm-brand-copy"><span>UX-KB</span><span className="adm-brand-sub">Member portal</span></span>
        </Link>

        <nav className="adm-nav" aria-label="Member navigation">
          <div className="adm-nav-group">
            <span className="adm-nav-label">Account</span>
            {NAV.map((item) => {
              const active = item.href === "/member" ? pathname === "/member" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`adm-nav-link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
                  <span className="adm-nav-icon">{icon(item.icon)}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-user">
            <span className="adm-avatar" aria-hidden="true">{initials}</span>
            <span className="adm-user-copy">
              <span className="adm-user-name">{displayName}</span>
              <span className="adm-user-meta">
                <span className="adm-role">{user.role}</span>
                <span>@{user.login}</span>
              </span>
            </span>
          </div>
          <form action={signOut}>
            <button className="adm-signout" type="submit">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
