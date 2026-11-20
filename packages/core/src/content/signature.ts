import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Content signing (§13.4). The etag already hashes the document; the server
 * signature binds that etag to the serving process so clients can detect
 * tampering in transit. Set UXKB_SIGNING_KEY in production; the fallback is
 * only for local development and tests.
 */
export const CONTENT_SIGNATURE_ALGORITHM = "hmac-sha256";

export const DEV_SIGNING_KEY = "ux-kb-local-dev-signing-key";

export function signingKey(env: NodeJS.ProcessEnv = process.env): string {
  return env.UXKB_SIGNING_KEY || DEV_SIGNING_KEY;
}

export function signEtag(etag: string, secret: string = signingKey()): string {
  const digest = createHmac("sha256", secret).update(etag).digest("hex");
  return `${CONTENT_SIGNATURE_ALGORITHM}:${digest}`;
}

export function verifyEtagSignature(
  etag: string,
  signature: string,
  secret: string = signingKey(),
): boolean {
  const expected = signEtag(etag, secret);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
