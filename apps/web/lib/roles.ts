import { redirect } from "next/navigation";
import { getSessionUser } from "./authz";
import type { UserRecord } from "@ux-kb/core/store";

export type AppRole = "MEMBER" | "ADMIN";

export function hasRole(user: UserRecord, role: AppRole): boolean {
  return user.role === role || user.role === "ADMIN";
}

export async function requireRole(role: AppRole): Promise<UserRecord> {
  const user = await getSessionUser();
  if (!user) redirect("/signin");
  if (!hasRole(user, role)) redirect("/dashboard");
  return user;
}
