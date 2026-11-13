"use server";

import { revalidatePath } from "next/cache";
import { createApiKey, KbError, KEY_LIMITS } from "@ux-kb/core";
import { getStore } from "@/lib/store";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";

const NAME_PATTERN = /^[\p{L}\p{N} ._:/-]{1,64}$/u;
const EXPIRY_DAYS = new Set([30, 90, 365]);

export type CreateKeyState = {
  key: string | null;
  name: string | null;
  error: string | null;
};

export type KeyActionResult = {
  key?: string;
  error?: string;
};

function expiryFrom(value: FormDataEntryValue | null, isAdmin: boolean): Date | null {
  const raw = String(value ?? "90");
  if (raw === "never") {
    // Indefinite keys are an admin-only capability.
    return isAdmin ? null : new Date(Date.now() + 90 * 86_400_000);
  }
  const days = Number(raw);
  const safeDays = EXPIRY_DAYS.has(days) ? days : 90;
  return new Date(Date.now() + safeDays * 86_400_000);
}

export async function createKeyAction(
  _previous: CreateKeyState,
  formData: FormData,
): Promise<CreateKeyState> {
  const user = await requireUserForAction();
  if (!user) return { key: null, name: null, error: "Your session expired. Sign in again." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { key: null, name: null, error: "Give the key a name." };
  if (!NAME_PATTERN.test(name)) {
    return {
      key: null,
      name: null,
      error: "Use 1-64 letters, numbers, spaces, or . _ : / -",
    };
  }

  const limits = KEY_LIMITS[user.role];
  const requestedRate = Number(formData.get("rateLimit") ?? limits.defaultRateLimit);
  const rateLimit = Number.isInteger(requestedRate)
    ? Math.min(Math.max(requestedRate, 10), limits.maxRateLimit)
    : limits.defaultRateLimit;

  try {
    const store = await getStore();
    const created = await createApiKey(store, {
      name,
      ownerId: user.id,
      role: user.role,
      rateLimit,
      expiresAt: expiryFrom(formData.get("expiry"), user.role === "ADMIN"),
    });
    await recordAudit({
      user,
      action: "key.create",
      target: created.record.id,
      metadata: { name: created.record.name, rateLimit: created.record.rateLimit },
    });
    revalidatePath("/dashboard/keys");
    revalidatePath("/dashboard");
    return { key: created.key, name: created.record.name, error: null };
  } catch (error) {
    if (error instanceof KbError) {
      return { key: null, name: null, error: error.message };
    }
    console.error("key.create_failed", {
      userId: user.id,
      error: error instanceof Error ? error.message : String(error),
    });
    return { key: null, name: null, error: "Could not create the key. Try again." };
  }
}

export async function revokeKeyAction(id: string): Promise<KeyActionResult> {
  const user = await requireUserForAction();
  if (!user) return { error: "Your session expired. Sign in again." };

  const store = await getStore();
  const key = await store.getKey(id);
  // Do not reveal whether a key exists to a different owner.
  if (!key || key.ownerId !== user.id) return { error: "Key not found." };
  if (key.revokedAt) return {};

  await store.revokeKey(id, "revoked by owner");
  await recordAudit({ user, action: "key.revoke", target: id, metadata: { name: key.name } });
  revalidatePath("/dashboard/keys");
  revalidatePath("/dashboard");
  return {};
}

export async function rotateKeyAction(id: string): Promise<KeyActionResult> {
  const user = await requireUserForAction();
  if (!user) return { error: "Your session expired. Sign in again." };

  const store = await getStore();
  const old = await store.getKey(id);
  if (!old || old.ownerId !== user.id) return { error: "Key not found." };
  if (old.revokedAt) return { error: "That key is already revoked." };

  try {
    const created = await createApiKey(store, {
      name: old.name,
      ownerId: user.id,
      role: user.role,
      rateLimit: old.rateLimit,
      expiresAt: old.expiresAt,
      pinnedVersion: old.pinnedVersion,
      scopes: old.scopes,
      bypassKeyLimit: true,
    });
    await store.revokeKey(id, `rotated to ${created.record.id}`);
    await recordAudit({
      user,
      action: "key.rotate",
      target: id,
      metadata: { replacement: created.record.id },
    });
    revalidatePath("/dashboard/keys");
    return { key: created.key };
  } catch (error) {
    console.error("key.rotate_failed", {
      userId: user.id,
      error: error instanceof Error ? error.message : String(error),
    });
    return { error: "Could not rotate the key. Try again." };
  }
}
