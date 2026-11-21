"use server";

import { revalidatePath } from "next/cache";
import { getStore } from "@/lib/store";
import { requireActionForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";
import { verifyStepUp } from "@/lib/mfa-guard";
import { ASSIGNABLE_ROLES } from "@/lib/policy";
import type { UserRole } from "@ux-kb/core/store";

export type UserActionResult = { error?: string };

/**
 * Count the admins that can still act. A suspended admin cannot sign in, so it
 * does not count toward the minimum. Locking every admin out is unrecoverable
 * without database access, so the last one is protected.
 */
async function activeAdminCount(store: Awaited<ReturnType<typeof getStore>>, excludeId?: string) {
  const users = await store.listUsers();
  return users.filter(
    (candidate) =>
      candidate.role === "ADMIN" && !candidate.suspendedAt && candidate.id !== excludeId,
  ).length;
}

export async function setRoleAction(
  id: string,
  role: string,
  mfaCode = "",
): Promise<UserActionResult> {
  const actor = await requireActionForAction("user.manage");
  if (!actor) return { error: "You do not have permission to change roles." };

  const stepUp = await verifyStepUp(actor, mfaCode);
  if (!stepUp.ok) return { error: stepUp.error ?? "MFA code required." };

  if (!(ASSIGNABLE_ROLES as readonly string[]).includes(role)) {
    return { error: `Unknown role "${role}".` };
  }

  const store = await getStore();
  const target = await store.getUser(id);
  if (!target) return { error: "User not found." };

  if (target.id === actor.id) {
    return { error: "You cannot change your own role. Ask another admin." };
  }

  if (target.role === role) return {};
  if (target.role === "ADMIN" && role !== "ADMIN") {
    const remaining = await activeAdminCount(store, target.id);
    if (remaining === 0) {
      return { error: "This is the last active admin. Promote another admin first." };
    }
  }

  await store.setUserRole(id, role as UserRole);
  await recordAudit({
    user: actor,
    action: "user.role_change",
    target: `github:${target.login}`,
    metadata: { from: target.role, to: role },
  });
  revalidatePath("/dashboard/users");
  return {};
}

export async function setSuspendedAction(
  id: string,
  suspended: boolean,
  mfaCode = "",
): Promise<UserActionResult> {
  const actor = await requireActionForAction("user.manage");
  if (!actor) return { error: "You do not have permission to suspend users." };

  const stepUp = await verifyStepUp(actor, mfaCode);
  if (!stepUp.ok) return { error: stepUp.error ?? "MFA code required." };

  const store = await getStore();
  const target = await store.getUser(id);
  if (!target) return { error: "User not found." };
  if (target.id === actor.id) return { error: "You cannot suspend your own account." };

  if (suspended && target.role === "ADMIN") {
    const remaining = await activeAdminCount(store, target.id);
    if (remaining === 0) {
      return { error: "This is the last active admin. Promote another admin first." };
    }
  }

  await store.setUserSuspended(id, suspended);
  if (suspended) {
    // A suspended user must not keep usable credentials.
    const keys = await store.listKeysByOwner(id);
    for (const key of keys) {
      if (!key.revokedAt) await store.revokeKey(key.id, "owner suspended");
    }
  }
  await recordAudit({
    user: actor,
    action: suspended ? "user.suspend" : "user.restore",
    target: `github:${target.login}`,
    metadata: { activeKeysRevoked: suspended },
  });
  revalidatePath("/dashboard/users");
  revalidatePath("/dashboard/keys");
  return {};
}
