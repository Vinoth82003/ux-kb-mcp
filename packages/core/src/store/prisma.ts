import type { Prisma, PrismaClient } from "@prisma/client";
import type {
  ApiKeyRecord,
  ComplianceInput,
  ComplianceRecord,
  CreateApiKeyInput,
  CreateSessionInput,
  GapRecord,
  KbStore,
  SessionRecord,
  UsageInput,
  UsageRecord,
} from "./types";

/** Postgres-backed store. Requires `prisma generate` and a migrated database. */
export class PrismaStore implements KbStore {
  constructor(private readonly prisma: PrismaClient) {}

  async createKey(input: CreateApiKeyInput): Promise<ApiKeyRecord> {
    return this.prisma.apiKey.create({
      data: {
        name: input.name,
        hashedKey: input.hashedKey,
        pinnedVersion: input.pinnedVersion ?? null,
        rateLimit: input.rateLimit ?? 120,
      },
    });
  }

  async findKeyByHash(hashedKey: string): Promise<ApiKeyRecord | null> {
    return this.prisma.apiKey.findUnique({ where: { hashedKey } });
  }

  async getKey(id: string): Promise<ApiKeyRecord | null> {
    return this.prisma.apiKey.findUnique({ where: { id } });
  }

  async listKeys(): Promise<ApiKeyRecord[]> {
    return this.prisma.apiKey.findMany({ orderBy: { createdAt: "desc" } });
  }

  async revokeKey(id: string): Promise<ApiKeyRecord | null> {
    const existing = await this.prisma.apiKey.findUnique({ where: { id } });
    if (!existing) return null;
    return this.prisma.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
  }

  async touchKey(id: string): Promise<void> {
    await this.prisma.apiKey.update({ where: { id }, data: { lastUsedAt: new Date() } });
  }

  async createSession(input: CreateSessionInput): Promise<SessionRecord> {
    return this.prisma.session.create({
      data: {
        apiKeyId: input.apiKeyId,
        feature: input.feature,
        kbVersion: input.kbVersion,
      },
    });
  }

  async getSession(id: string): Promise<SessionRecord | null> {
    return this.prisma.session.findUnique({ where: { id } });
  }

  async addFetched(sessionId: string, ids: string[]): Promise<void> {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) return;
    const merged = [...new Set([...session.fetched, ...ids])];
    await this.prisma.session.update({ where: { id: sessionId }, data: { fetched: merged } });
  }

  async logUsage(input: UsageInput): Promise<UsageRecord> {
    return this.prisma.usageLog.create({
      data: {
        apiKeyId: input.apiKeyId,
        sessionId: input.sessionId ?? null,
        tool: input.tool,
        args: input.args as Prisma.InputJsonValue,
        latencyMs: input.latencyMs,
        ok: input.ok,
      },
    });
  }

  async listUsage(apiKeyId?: string, limit = 100): Promise<UsageRecord[]> {
    const rows = await this.prisma.usageLog.findMany({
      where: apiKeyId ? { apiKeyId } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map((row) => ({ ...row, args: row.args as unknown }));
  }

  async saveCompliance(input: ComplianceInput): Promise<ComplianceRecord> {
    return this.prisma.compliance.create({
      data: {
        sessionId: input.sessionId,
        citedIds: input.citedIds,
        unfetched: input.unfetched,
        unknown: input.unknown,
      },
    });
  }

  async listCompliance(sessionId?: string, limit = 100): Promise<ComplianceRecord[]> {
    return this.prisma.compliance.findMany({
      where: sessionId ? { sessionId } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async upsertGap(topic: string, context: string): Promise<GapRecord> {
    return this.prisma.kbGap.upsert({
      where: { topic },
      create: { topic, context },
      update: { count: { increment: 1 }, context },
    });
  }

  async listGaps(includeResolved = false): Promise<GapRecord[]> {
    return this.prisma.kbGap.findMany({
      where: includeResolved ? undefined : { resolved: false },
      orderBy: { count: "desc" },
    });
  }
}
