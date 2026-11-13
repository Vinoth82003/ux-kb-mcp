import { createKb } from "@ux-kb/core";

const globalForKb = globalThis as unknown as { kb?: ReturnType<typeof createKb> };

export function getKb() {
  if (!globalForKb.kb) {
    globalForKb.kb = createKb();
  }
  return globalForKb.kb;
}
