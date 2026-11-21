// Minimal TOTP (RFC 6238) using HMAC-SHA1. No external deps.

function base32Decode(input: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = input.replace(/=+$/, "").toUpperCase().replace(/\s/g, "");
  let bits = "";
  for (const ch of cleaned) {
    const idx = alphabet.indexOf(ch);
    if (idx < 0) throw new Error("Invalid base32");
    bits += idx.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

async function hmacSha1(key: Uint8Array, msg: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key as BufferSource, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, msg as BufferSource);
  return new Uint8Array(sig);
}

export function generateSecret(length = 20): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let out = "";
  for (const b of bytes) out += alphabet[b % 32];
  // pad to multiple of 8
  while (out.length % 8 !== 0) out += "=";
  return out;
}

export async function totpCode(secret: string, time: number = Date.now()): Promise<string> {
  const counter = Math.floor(time / 1000 / 30);
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setBigUint64(0, BigInt(counter));
  const key = base32Decode(secret);
  const hmac = await hmacSha1(key, new Uint8Array(buf));
  const offset = hmac[hmac.length - 1]! & 0x0f;
  const code =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff);
  return (code % 1000000).toString().padStart(6, "0");
}

export async function verifyTotp(secret: string, code: string, window = 1): Promise<boolean> {
  const now = Date.now();
  for (let i = -window; i <= window; i++) {
    const t = now + i * 30000;
    const expected = await totpCode(secret, t);
    if (expected === code.trim()) return true;
  }
  return false;
}
