"use server";

import { createApiKey } from "@ux-kb/core";
import { getStore } from "@/lib/store";

export type CreateKeyState = { key: string | null; name: string | null; error: string | null };

export async function createKeyAction(_prev: CreateKeyState, formData: FormData): Promise<CreateKeyState> {
  const name = String(formData.get("name") ?? "").trim();
  const rateLimit = Number(formData.get("rateLimit") ?? 120);
  if (!name) return { key: null, name: null, error: "Name is required." };
  try {
    const store = await getStore();
    const created = await createApiKey(store, { name, rateLimit: Number.isFinite(rateLimit) ? rateLimit : 120 });
    return { key: created.key, name: created.record.name, error: null };
  } catch (e) {
    return { key: null, name: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function revokeKeyAction(id: string) {
  const store = await getStore();
  await store.revokeKey(id);
}
