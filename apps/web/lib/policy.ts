import type { UserRecord } from "@ux-kb/core/store";

export type Action =
  | "doc.read"
  | "doc.write"
  | "doc.publish"
  | "key.manage"
  | "user.manage"
  | "config.write"
  | "release.manage";

const ADMIN_ONLY: Action[] = ["doc.publish", "key.manage", "user.manage", "config.write", "release.manage"];

export function can(user: UserRecord | null, action: Action): boolean {
  if (!user || user.suspendedAt) return false;
  if (user.role === "ADMIN") return true;
  if (ADMIN_ONLY.includes(action)) return false;
  // MEMBER can read and write drafts.
  if (action === "doc.read" || action === "doc.write") return true;
  return false;
}
