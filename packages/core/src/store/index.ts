import { MemoryStore } from "./memory";
import type { KbStore } from "./types";

export * from "./types";
export * from "./memory";

export interface CreateStoreOptions {
  /** "db" uses Postgres; "memory" is process-local. Defaults from env. */
  kind?: "db" | "memory";
}

/**
 * Resolve the auth/usage store from configuration.
 *
 * KB_STORE=db (or a DATABASE_URL) selects Postgres; KB_STORE=memory forces the
 * in-memory store so the stdio server and tests need no infrastructure.
 */
export async function createStore(options: CreateStoreOptions = {}): Promise<KbStore> {
  const configured =
    options.kind ??
    (process.env.KB_STORE === "memory"
      ? "memory"
      : process.env.KB_STORE === "db" || process.env.DATABASE_URL
        ? "db"
        : "memory");

  if (configured === "db") {
    const [{ PrismaStore }, { getPrisma }] = await Promise.all([
      import("./prisma"),
      import("../db"),
    ]);
    return new PrismaStore(getPrisma());
  }

  return new MemoryStore();
}
