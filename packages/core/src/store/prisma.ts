import type { Prisma, PrismaClient } from "@prisma/client";
import type {
  ApiKeyRecord,
  AuditInput,
  AuditRecord,
  ComplianceInput,
  ComplianceRecord,
  CreateApiKeyInput,
  CreateSessionInput,
  GapRecord,
  KbStore,
  SessionRecord,
  UpsertUserInput,
  UsageInput,
  UsageRecord,
  UserRecord,
} from "./types";

/** Postgres-backed store. Requires `prisma generate` and a migrated database. */
export class PrismaStore implements KbStore {
  constructor(private readonly prisma: PrismaClient) {}

  // --- users ---------------------------------------------------------------

  async upsertUser(input: UpsertUserInput): Promise<UserRecord> {
    return this.prisma.user.upsert({
      where: { githubId: input.githubId },
      create: {
        githubId: input.githubId,
        login: input.login,
        email: input.email ?? null,
        name: input.name ?? null,
        avatarUrl: input.avatarUrl ?? null,
        role: input.role ?? "MEMBER",
        lastLoginAt: new Date(),
      },
      update: {
        login: input.login,
        email: input.email ?? null,
        name: input.name ?? null,
        avatarUrl: input.avatarUrl ?? null,
        lastLoginAt: new Date(),
        ...(input.role ? { role: input.role } : {}),
      },
    });
  }

  async findUserByGithubId(githubId: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { githubId } });
  }

  async getUser(id: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async listUsers(): Promise<UserRecord[]> {
    return this.prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  }

  async setUserSuspended(id: string, suspended: boolean): Promise<UserRecord | null> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) return null;
    return this.prisma.user.update({
      where: { id },
      data: { suspendedAt: suspended ? new Date() : null },
    });
  }

  // --- API keys ------------------------------------------------------------

  async createKey(input: CreateApiKeyInput): Promise<ApiKeyRecord> {
    return this.prisma.apiKey.create({
      data: {
        name: input.name,
        hashedKey: input.hashedKey,
        prefix: input.prefix ?? "",
        scopes: input.scopes ?? ["mcp:read"],
        pinnedVersion: input.pinnedVersion ?? null,
        rateLimit: input.rateLimit ?? 60,
        expiresAt: input.expiresAt ?? null,
        ownerId: input.ownerId ?? null,
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

  async listKeysByOwner(ownerId: string): Promise<ApiKeyRecord[]> {
    return this.prisma.apiKey.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });
  }

  async countActiveKeys(ownerId: string): Promise<number> {
    return this.prisma.apiKey.count({ where: { ownerId, revokedAt: null } });
  }

  async revokeKey(id: string, reason?: string): Promise<ApiKeyRecord | null> {
    const existing = await this.prisma.apiKey.findUnique({ where: { id } });
    if (!existing) return null;
    return this.prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date(), revokedReason: reason ?? null },
    });
  }

  async touchKey(id: string, ip?: string): Promise<void> {
    await this.prisma.apiKey.update({
      where: { id },
      data: { lastUsedAt: new Date(), ...(ip ? { lastUsedIp: ip } : {}) },
    });
  }

  // --- sessions ------------------------------------------------------------

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

  // --- usage ---------------------------------------------------------------

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

  async listUsageByOwner(ownerId: string, limit = 100): Promise<UsageRecord[]> {
    const rows = await this.prisma.usageLog.findMany({
      where: { apiKey: { ownerId } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map((row) => ({ ...row, args: row.args as unknown }));
  }

  // --- compliance ----------------------------------------------------------

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

  // --- gaps ----------------------------------------------------------------

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

  // --- audit ---------------------------------------------------------------

  async audit(input: AuditInput): Promise<AuditRecord> {
    return this.prisma.auditLog.create({
      data: {
        actor: input.actor,
        actorUserId: input.actorUserId ?? null,
        action: input.action,
        target: input.target,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        ...(input.metadata === undefined
          ? {}
          : { metadata: input.metadata as Prisma.InputJsonValue }),
      },
    });
  }

  async listAudit(limit = 100): Promise<AuditRecord[]> {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
