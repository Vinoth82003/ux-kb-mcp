import { createStore } from "@ux-kb/core/store";

const globalForStore = globalThis as unknown as { store?: Awaited<ReturnType<typeof createStore>> };

export async function getStore() {
  if (!globalForStore.store) {
    globalForStore.store = await createStore({ kind: "db" });
  }
  return globalForStore.store;
}
