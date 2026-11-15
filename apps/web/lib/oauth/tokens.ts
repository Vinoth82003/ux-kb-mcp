import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { hashApiKey } from "@ux-kb/core";

export const TOKEN_PREFIXES = {
  access: "uxko_",
  refresh: "uxkr_",
  code: "uxkc_",
  client: "uxkclient_",
  clientSecret: "uxks_",
} as const;

const ACCESS_TOKEN_PATTERN = /^uxko_[A-Za-z0-9_-]{40,64}$/;
const REFRESH_TOKEN_PATTERN = /^uxkr_[A-Za-z0-9_-]{40,64}$/;

export function randomToken(prefix: string, bytes = 32): string {
  return `${prefix}${randomBytes(bytes).toString("base64url")}`;
}

/**
 * Tokens are stored as HMAC-SHA256 hashes, exactly like API keys. A database
 * leak therefore does not leak a usable credential.
 */
export function hashToken(token: string): string {
  return hashApiKey(token);
}

/** Cheap shape check; the database hash lookup does the real validation. */
export function looksLikeAccessToken(value: string): boolean {
  return ACCESS_TOKEN_PATTERN.test(value);
}

export function looksLikeRefreshToken(value: string): boolean {
  return REFRESH_TOKEN_PATTERN.test(value);
}

/** RFC 7636 S256: BASE64URL(SHA256(ASCII(code_verifier))). */
export function pkceChallenge(verifier: string): string {
  return createHash("sha256").update(verifier, "ascii").digest("base64url");
}

export function verifyPkce(verifier: string, challenge: string): boolean {
  const computed = Buffer.from(pkceChallenge(verifier), "utf8");
  const expected = Buffer.from(challenge, "utf8");
  return computed.length === expected.length && timingSafeEqual(computed, expected);
}

/** Compare a presented client secret against the stored hash. */
export function verifyClientSecret(secret: string, storedHash: string): boolean {
  const computed = Buffer.from(hashToken(secret), "utf8");
  const expected = Buffer.from(storedHash, "utf8");
  return computed.length === expected.length && timingSafeEqual(computed, expected);
}

/** PKCE verifiers are 43-128 unreserved characters per RFC 7636. */
export function isValidCodeVerifier(value: string): boolean {
  return /^[A-Za-z0-9\-._~]{43,128}$/.test(value);
}

export function isValidPkceChallenge(value: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(value);
}
