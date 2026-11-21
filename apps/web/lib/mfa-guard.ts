import type { UserRecord } from "@ux-kb/core/store";
import { verifyTotp } from "./mfa";
import { decryptSecret } from "./mfa-crypto";

/**
 * Actions that can change published content or access. When the signed-in user
 * has MFA enabled, each of these requires a fresh authenticator code.
 */
export const STEP_UP_ACTIONS = new Set([
  "doc.publish",
  "key.manage",
  "user.manage",
  "config.write",
  "release.manage",
]);

export interface StepUpResult {
  ok: boolean;
  error?: string;
}

/** Verify a TOTP code for a user, returning a safe error message on failure. */
export async function verifyStepUp(user: UserRecord, code: string | undefined): Promise<StepUpResult> {
  if (!user.mfaEnabled) return { ok: true };
  if (!user.mfaSecret) return { ok: false, error: "MFA is enabled but not configured. Contact an admin." };
  const trimmed = (code ?? "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(trimmed)) {
    return { ok: false, error: "Enter the 6-digit code from your authenticator app." };
  }
  try {
    const valid = await verifyTotp(decryptSecret(user.mfaSecret), trimmed);
    return valid ? { ok: true } : { ok: false, error: "That code is invalid or expired. Try the next one." };
  } catch {
    return { ok: false, error: "Could not verify the authenticator code." };
  }
}
