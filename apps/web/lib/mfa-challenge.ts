import { createHmac } from "node:crypto";

function secret(): string {
  return process.env.AUTH_SECRET ?? process.env.KEY_HASH_SECRET ?? "dev-mfa-proof";
}

/** Server-issued proof that the user passed the login-time MFA challenge. */
export function issueProof(uid: string): string {
  return createHmac("sha256", secret()).update(`mfa:${uid}`).digest("hex");
}

export function verifyProof(uid: string, proof: string | undefined): boolean {
  if (!proof) return false;
  const expected = issueProof(uid);
  if (proof.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < proof.length; i++) {
    diff |= proof.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
