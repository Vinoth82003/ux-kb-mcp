import { PrismaClient } from "@prisma/client";

let client: PrismaClient | undefined;

/**
 * Lazily create a singleton Prisma client. Kept out of the package root export
 * so the file-backed server runs without generated Prisma artifacts.
 */
export function getPrisma(): PrismaClient {
  if (!client) {
    client = new PrismaClient();
  }
  return client;
}

export async function disconnectPrisma(): Promise<void> {
  if (client) {
    await client.$disconnect();
    client = undefined;
  }
}
