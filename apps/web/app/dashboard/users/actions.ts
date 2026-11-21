"use server";

import { revalidatePath } from "next/cache";
import { getStore } from "@/lib/store";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";

export type UserActionResult = { error?: string };

export async function setSuspendedAction(
  id: string,
  suspend: boolean,
): Promise<UserActionResult> {
  const admin = await requireUserForAction();
  if (!admin || admin.role !== "ADMIN") return { error: "Not authorized." };

  const store = await getStore();
  const target = await store.getUser(id);
  if (!target) return { error: "User not found." };
  if (target.id === admin.id && suspend) return { error: "You cannot suspend yourself." };

  await store.setUserSuspended(id, suspend);
  await recordAudit({
    user: admin,
    action: suspend ? "user.suspend" : "user.restore",
    target: id,
    metadata: { login: target.login },
  });
  revalidatePath("/dashboard/users");
  return {};
}

export async function setRoleAction(id: string, role: string): Promise<UserActionResult> {
  const admin = await requireUserForAction();
  if (!admin || admin.role !== "ADMIN") return { error: "Not authorized." };

  const allowed = ["MEMBER", "ADMIN"];
  if (!allowed.includes(role)) return { error: "Invalid role." };

  const store = await getStore();
  const target = await store.getUser(id);
  if (!target) return { error: "User not found." };
  if (target.id === admin.id && role !== "ADMIN") {
    return { error: "You cannot remove your own admin role." };
  }

  await store.setUserRole(id, role as any);
  await recordAudit({ user: admin, action: "user.role_change", target: id, metadata: { from: target.role, to: role } });
  revalidatePath("/dashboard/users");
  return {};
}
