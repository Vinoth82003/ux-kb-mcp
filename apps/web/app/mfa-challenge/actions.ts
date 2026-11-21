"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/store";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";
import { decryptSecret } from "@/lib/mfa-crypto";
import { verifyTotp } from "@/lib/mfa";
import { issueProof } from "@/lib/mfa-challenge";

export async function verifyMfaChallengeAction(code: string): Promise<{ error?: string; ok?: boolean }> {
  const user = await requireUserForAction();
  if (!user) return { error: "Your session expired. Sign in again." };
  if (!user.mfaEnabled) {
    // Nothing to verify; let the user through.
    return { ok: true };
  }
  if (!user.mfaSecret) return { error: "MFA is enabled but not configured. Contact an admin." };

  const trimmed = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(trimmed)) return { error: "Enter the 6-digit code from your authenticator app." };

  let valid = false;
  try {
    valid = await verifyTotp(decryptSecret(user.mfaSecret), trimmed);
  } catch {
    return { error: "Could not verify the code. Try again." };
  }
  if (!valid) return { error: "That code is invalid or expired. Try the next one." };

  const cookieStore = await cookies();
  cookieStore.set("mfa_proof", issueProof(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60,
  });

  await recordAudit({ user, action: "auth.mfa_challenge_passed", target: user.id });
  return { ok: true };
}

export async function cancelMfaChallengeAction(): Promise<void> {
  const user = await requireUserForAction();
  if (user) {
    await recordAudit({ user, action: "auth.mfa_challenge_cancelled", target: user.id });
  }
  // Clear the proof cookie if any.
  try {
    (await cookies()).delete("mfa_proof");
  } catch {
    /* ignore */
  }
  redirect("/signin");
}
