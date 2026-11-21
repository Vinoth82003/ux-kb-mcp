import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * TOTP secrets are encrypted at rest with AES-256-GCM. The key is derived from
 * MFA_ENCRYPTION_KEY (preferred) or AUTH_SECRET so a database leak does not
 * hand an attacker a second factor.
 */
function key(): Buffer {
  const secret =
    process.env.MFA_ENCRYPTION_KEY ??
    process.env.AUTH_SECRET ??
    process.env.KEY_HASH_SECRET;
  if (!secret) {
    throw new Error("MFA encryption key is not configured (MFA_ENCRYPTION_KEY or AUTH_SECRET).");
  }
  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    "v1",
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function decryptSecret(value: string): string {
  // Values written before encryption was introduced are stored in plain base32.
  if (!value.startsWith("v1.")) return value;
  const [, ivB64, tagB64, dataB64] = value.split(".");
  if (!ivB64 || !tagB64 || !dataB64) throw new Error("Malformed encrypted secret");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
