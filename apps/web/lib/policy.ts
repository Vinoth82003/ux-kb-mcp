import type { UserRecord } from "@ux-kb/core/store";

export type Action =
  | "doc.read"
  | "doc.write"
  | "doc.publish"
  | "key.manage"
  | "user.manage"
  | "config.write"
  | "release.manage";

const ADMIN_ONLY: Action[] = [
  "doc.publish",
  "key.manage",
  "user.manage",
  "config.write",
  "release.manage",
];

/** Capabilities rendered by the Security page so the policy is inspectable. */
export const ACTION_MATRIX: { action: Action; label: string; member: boolean }[] = [
  { action: "doc.read", label: "Read documents and gates", member: true },
  { action: "doc.write", label: "Create and edit drafts", member: true },
  { action: "doc.publish", label: "Approve and publish changes", member: false },
  { action: "key.manage", label: "Manage API keys", member: false },
  { action: "user.manage", label: "Manage users, roles and audit export", member: false },
  { action: "config.write", label: "Change configuration and export backups", member: false },
  { action: "release.manage", label: "Stage, promote and roll back releases", member: false },
];

/** Roles that can actually be assigned. The database enum is MEMBER/ADMIN. */
export const ASSIGNABLE_ROLES = ["MEMBER", "ADMIN"] as const;

export const ROLE_LABELS: Record<string, string> = {
  MEMBER: "Member",
  ADMIN: "Admin",
};

export function can(user: UserRecord | null, action: Action): boolean {
  if (!user || user.suspendedAt) return false;
  if (user.role === "ADMIN") return true;
  if (ADMIN_ONLY.includes(action)) return false;
  return action === "doc.read" || action === "doc.write";
}

export function isAdmin(user: UserRecord | null): boolean {
  return Boolean(user && !user.suspendedAt && user.role === "ADMIN");
}
