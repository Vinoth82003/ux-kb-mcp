"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type IconName =
  | "overview"
  | "content"
  | "gate"
  | "routing"
  | "review"
  | "release"
  | "gap"
  | "noise"
  | "analytics"
  | "sessions"
  | "audit"
  | "keys"
  | "users"
  | "security"
  | "config";

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: "overview" }],
  },
  {
    label: "Knowledge",
    items: [
      { href: "/dashboard/content", label: "Documents", icon: "content" },
      { href: "/dashboard/gate", label: "Core gate", icon: "gate" },
      { href: "/dashboard/routing", label: "Routing", icon: "routing" },
      { href: "/dashboard/review", label: "Review", icon: "review" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/dashboard/releases", label: "Releases", icon: "release" },
      { href: "/dashboard/gaps", label: "Gaps inbox", icon: "gap" },
      { href: "/dashboard/false-positives", label: "Noisy checks", icon: "noise" },
      { href: "/dashboard/analytics", label: "Analytics", icon: "analytics" },
      { href: "/dashboard/sessions", label: "Sessions", icon: "sessions" },
      { href: "/dashboard/audit", label: "Audit log", icon: "audit" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/dashboard/keys", label: "API keys", icon: "keys" },
      { href: "/dashboard/users", label: "Users & roles", icon: "users" },
      { href: "/dashboard/security", label: "Security", icon: "security" },
      { href: "/dashboard/config", label: "Configuration", icon: "config" },
    ],
  },
];

function icon(name: IconName) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "overview":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "content":
      return (
        <svg {...common}>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 12h7M9 16h7" />
        </svg>
      );
    case "gate":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
          <path d="M9.5 12l1.8 1.8 3.4-3.6" />
        </svg>
      );
    case "routing":
      return (
        <svg {...common}>
          <circle cx="5" cy="6" r="2" />
          <circle cx="19" cy="6" r="2" />
          <circle cx="12" cy="18" r="2" />
          <path d="M7 6h10M6 8l5 8M18 8l-5 8" />
        </svg>
      );
    case "review":
      return (
        <svg {...common}>
          <path d="M4 5h16M4 12h10M4 19h7" />
          <path d="M16 15l2 2 4-4" />
        </svg>
      );
    case "release":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="M7 8l5-5 5 5" />
          <path d="M4 15v4h16v-4" />
        </svg>
      );
    case "gap":
      return (
        <svg {...common}>
          <path d="M4 5h16v11H9l-5 4z" />
          <path d="M9 9h6M9 12h4" />
        </svg>
      );
    case "noise":
      return (
        <svg {...common}>
          <path d="M3 12h3l2-6 4 12 2-6h7" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...common}>
          <path d="M4 20V4" />
          <path d="M4 20h16" />
          <rect x="7" y="12" width="3" height="5" />
          <rect x="12" y="8" width="3" height="9" />
          <rect x="17" y="5" width="3" height="12" />
        </svg>
      );
    case "sessions":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <path d="M16 4h5M16 8h5M16 12h3" />
        </svg>
      );
    case "audit":
      return (
        <svg {...common}>
          <path d="M5 3h14v18H5z" />
          <path d="M9 7h6M9 11h6M9 15h4" />
        </svg>
      );
    case "keys":
      return (
        <svg {...common}>
          <circle cx="8" cy="15" r="4" />
          <path d="M11 12l9-9M17 6l3 3M14 9l3 3" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <path d="M16 5a3 3 0 0 1 0 6M18 14c2.2.6 3 2.4 3 6" />
        </svg>
      );
    case "security":
      return (
        <svg {...common}>
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <path d="M12 14v2" />
        </svg>
      );
    case "config":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
        </svg>
      );
  }
}

export default function AdminSidebar({
  user,
  signOut,
}: {
  user: { login: string; name: string | null; role: string };
  signOut: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const sidebar = sidebarRef.current;
    if (sidebar) {
      const focusables = sidebar.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length > 0) focusables[0].focus();
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key === "Tab" && sidebar) {
        const elements = sidebar.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!elements || elements.length === 0) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const displayName = user.name?.trim() || user.login;
  const initials = displayName.slice(0, 2);

  return (
    <>
      <a className="adm-skip" href="#main-content">
        Skip to content
      </a>

      <div className="adm-topbar">
        <button
          ref={menuButtonRef}
          className="adm-menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="admin-sidebar"
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Menu
        </button>
        <Link href="/dashboard" className="adm-brand" style={{ padding: 0, border: 0 }}>
          <span className="adm-brand-mark" aria-hidden="true">UX</span>
          <span className="adm-brand-copy">
            <span>UX-KB</span>
            <span className="adm-brand-sub">Admin panel</span>
          </span>
        </Link>
      </div>

      <button
        type="button"
        className={`adm-backdrop ${open ? "is-open" : ""}`}
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
        onClick={() => {
          setOpen(false);
          menuButtonRef.current?.focus();
        }}
      />

      <aside id="admin-sidebar" ref={sidebarRef} className={`adm-sidebar ${open ? "is-open" : ""}`}>
        <Link href="/dashboard" className="adm-brand">
          <span className="adm-brand-mark" aria-hidden="true">UX</span>
          <span className="adm-brand-copy">
            <span>UX-KB</span>
            <span className="adm-brand-sub">Admin panel</span>
          </span>
        </Link>

        <nav className="adm-nav" aria-label="Admin navigation">
          {NAV.map((group) => (
            <div className="adm-nav-group" key={group.label}>
              <span className="adm-nav-label">{group.label}</span>
              {group.items.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`adm-nav-link ${active ? "is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className="adm-nav-icon">{icon(item.icon)}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-user">
            <span className="adm-avatar" aria-hidden="true">{initials}</span>
            <span className="adm-user-copy">
              <span className="adm-user-name">{displayName}</span>
              <span className="adm-user-meta">
                <span className={`adm-role ${user.role === "ADMIN" ? "is-admin" : ""}`}>{user.role}</span>
                <span>@{user.login}</span>
              </span>
            </span>
          </div>
          <form action={signOut}>
            <button className="adm-signout" type="submit">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5M21 12H9" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
