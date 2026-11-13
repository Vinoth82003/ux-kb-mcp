#!/usr/bin/env node
/**
 * API key and gap administration.
 *
 *   pnpm kb:keys create --name laptop [--rate-limit 120] [--pin 1.0.0]
 *   pnpm kb:keys list
 *   pnpm kb:keys revoke <id>
 *   pnpm kb:keys gaps [--all]
 *
 * Requires DATABASE_URL. The stdio server needs no key; local HTTP can use
 * MCP_DEV_KEY instead.
 */
import { createApiKey } from "../services/auth.service";
import { createStore } from "../store/index";

interface Args {
  command: string;
  rest: string[];
  name?: string;
  rateLimit?: number;
  pin?: string;
  all: boolean;
}

function parse(argv: string[]): Args {
  const [command = "help", ...rest] = argv;
  const args: Args = { command, rest, all: false };

  for (let i = 0; i < rest.length; i += 1) {
    const value = rest[i];
    if (value === "--name") args.name = rest[++i];
    else if (value === "--rate-limit") args.rateLimit = Number(rest[++i]);
    else if (value === "--pin") args.pin = rest[++i];
    else if (value === "--all") args.all = true;
  }
  return args;
}

function requireDatabase(): void {
  if (!process.env.DATABASE_URL) {
    console.error(
      [
        "DATABASE_URL is not set.",
        "API keys must persist across processes; use Postgres.",
        "For local stdio no key is needed; for local HTTP set MCP_DEV_KEY.",
      ].join("\n"),
    );
    process.exit(2);
  }
}

async function main(): Promise<void> {
  const args = parse(process.argv.slice(2));

  if (args.command === "help") {
    console.log(
      [
        "Usage: ux-kb-keys <command>",
        "",
        "  create --name <name> [--rate-limit 120] [--pin 1.0.0]",
        "  list",
        "  revoke <id>",
        "  gaps [--all]",
      ].join("\n"),
    );
    return;
  }

  requireDatabase();
  const store = await createStore({ kind: "db" });

  switch (args.command) {
    case "create": {
      if (!args.name) throw new Error("create requires --name");
      if (args.rateLimit !== undefined && (!Number.isFinite(args.rateLimit) || args.rateLimit < 1)) {
        throw new Error("--rate-limit must be a positive number");
      }
      const { key, record } = await createApiKey(store, {
        name: args.name,
        pinnedVersion: args.pin ?? null,
        rateLimit: args.rateLimit,
      });
      console.log(`Created ${record.id} (${record.name}).`);
      console.log(`Key (shown once): ${key}`);
      console.log(`Rate limit: ${record.rateLimit}/minute | pinned: ${record.pinnedVersion ?? "active release"}`);
      break;
    }
    case "list": {
      const keys = await store.listKeys();
      if (keys.length === 0) {
        console.log("No API keys.");
        break;
      }
      for (const key of keys) {
        console.log(
          `${key.id}  ${key.name.padEnd(24)} ${key.revokedAt ? "REVOKED" : "active"}  ` +
            `${key.rateLimit}/min  pinned=${key.pinnedVersion ?? "-"}  ` +
            `lastUsed=${key.lastUsedAt?.toISOString() ?? "never"}`,
        );
      }
      break;
    }
    case "revoke": {
      const id = args.rest.find((value) => !value.startsWith("--"));
      if (!id) throw new Error("revoke requires a key ID");
      const revoked = await store.revokeKey(id);
      console.log(revoked ? `Revoked ${id}.` : `No key with ID ${id}.`);
      if (!revoked) process.exitCode = 1;
      break;
    }
    case "gaps": {
      const gaps = await store.listGaps(args.all);
      if (gaps.length === 0) {
        console.log("No reported gaps.");
        break;
      }
      for (const gap of gaps) {
        console.log(`[${String(gap.count).padStart(3)}] ${gap.topic}`);
        console.log(`      ${gap.context.slice(0, 160)}`);
      }
      break;
    }
    default:
      throw new Error(`Unknown command "${args.command}".`);
  }

  // Prisma keeps the process alive; close explicitly when the store supports it.
  const maybeDisconnect = (store as { disconnect?: () => Promise<void> }).disconnect;
  if (maybeDisconnect) await maybeDisconnect();
  else {
    const { disconnectPrisma } = await import("../db");
    await disconnectPrisma();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
