"use server";

import { revalidatePath } from "next/cache";
import { signOut } from "@/auth";
import { getStore } from "@/lib/store";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";
import { decryptSecret, encryptSecret } from "@/lib/mfa-crypto";
import { generateSecret, verifyTotp } from "@/lib/mfa";

export interface MfaSetupResult {
  secret?: string;
  otpauth?: string;
  error?: string;
}

/** Begin enrollment: generate and persist an unconfirmed secret for this user. */
export async function startMfaSetupAction(): Promise<MfaSetupResult> {
  const user = await requireUserForAction();
  if (!user) return { error: "Your session expired. Sign in again." };
  if (user.mfaEnabled) return { error: "MFA is already enabled." };

  const secret = generateSecret();
  const store = await getStore();
  await store.setUserMfa(user.id, encryptSecret(secret), false);
  await recordAudit({
    user,
    action: "mfa.setup_started",
    target: user.id,
    metadata: { method: "totp" },
  });

  const label = encodeURIComponent(`UX-KB:${user.login}`);
  return {
    secret,
    otpauth: `otpauth://totp/${label}?secret=${secret}&issuer=UX-KB&algorithm=SHA1&digits=6&period=30`,
  };
}

/** Confirm enrollment with a live code, then turn the factor on. */
export async function confirmMfaAction(code: string): Promise<{ error?: string }> {
  const user = await requireUserForAction();
  if (!user) return { error: "Your session expired. Sign in again." };
  if (user.mfaEnabled) return { error: "MFA is already enabled." };
  if (!user.mfaSecret) return { error: "Start enrollment first." };

  const trimmed = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(trimmed)) return { error: "Enter the 6-digit code." };

  let valid = false;
  try {
    valid = await verifyTotp(decryptSecret(user.mfaSecret), trimmed);
  } catch {
    return { error: "Could not verify the code. Start enrollment again." };
  }
  if (!valid) return { error: "That code is invalid or expired. Try the next one." };

  const store = await getStore();
  await store.setUserMfa(user.id, user.mfaSecret, true);
  await recordAudit({ user, action: "mfa.enabled", target: user.id });
  revalidatePath("/dashboard/security");
  return {};
}

/** Turn MFA off. Requires a current code so a hijacked session cannot remove it. */
export async function disableMfaAction(code: string): Promise<{ error?: string }> {
  const user = await requireUserForAction();
  if (!user) return { error: "Your session expired. Sign in again." };
  if (!user.mfaEnabled) return { error: "MFA is not enabled." };

  const trimmed = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(trimmed)) return { error: "Enter the 6-digit code." };

  let valid = false;
  try {
    valid =
      Boolean(user.mfaSecret) && (await verifyTotp(decryptSecret(user.mfaSecret!), trimmed));
  } catch {
    return { error: "Could not verify the code." };
  }
  if (!valid) return { error: "That code is invalid or expired." };

  const store = await getStore();
  await store.setUserMfa(user.id, null, false);
  await recordAudit({ user, action: "mfa.disabled", target: user.id });
  revalidatePath("/dashboard/security");
  return {};
}

/** Sign out of this browser and return to the sign-in screen. */
export async function revokeSessionAction(): Promise<void> {
  const user = await requireUserForAction();
  if (user) {
    await recordAudit({ user, action: "auth.session_revoked", target: user.id });
  }
  await signOut({ redirectTo: "/signin" });
}
