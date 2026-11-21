"use server";

import { signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { getStore } from "@/lib/store";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";
import { can } from "@/lib/policy";

/** Sign the current browser session out and return to the public site. */
export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/signin" });
}

/** Mark a gap as covered. Audited because it changes reviewer state. */
export async function resolveGapAction(id: string): Promise<{ error?: string }> {
  const user = await requireUserForAction();
  if (!user || !can(user, "doc.write")) return { error: "Not authorized." };
  const store = await getStore();
  const gap = await store.resolveGap(id);
  if (!gap) return { error: "Gap not found." };
  await recordAudit({
    user,
    action: "gap.resolve",
    target: id,
    metadata: { topic: gap.topic },
  });
  revalidatePath("/dashboard/gaps");
  return {};
}
