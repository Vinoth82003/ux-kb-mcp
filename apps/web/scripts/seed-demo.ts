import { getStore } from "../lib/store";

async function main() {
  const store = await getStore();
  // Seed gaps
  await store.upsertGap("offline sync conflict UI", "Needed conflict resolution UI for offline edits.");
  await store.upsertGap("offline sync conflict UI", "Second report.");
  await store.upsertGap("chart accessibility", "Screen reader support for charts.");
  // Audit entry
  await store.audit({ actor: "seed", action: "seed.demo", target: "kb", metadata: { note: "demo data" } });
  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
