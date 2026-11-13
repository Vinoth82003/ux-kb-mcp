import { randomUUID } from "node:crypto";
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

/** In-memory store for tests and single-process local development. */
export class MemoryStore implements KbStore {
  private readonly users = new Map<string, UserRecord>();
  private readonly keys = new Map<string, ApiKeyRecord>();
  private readonly sessions = new Map<string, SessionRecord>();
  private readonly compliance: ComplianceRecord[] = [];
  private readonly gaps = new Map<string, GapRecord>();
  private readonly auditLog: AuditRecord[] = [];
  readonly usageLog: UsageRecord[] = [];

  async upsertUser(input: UpsertUserInput): Promise<UserRecord> {
    const existing = await this.findUserByGithubId(input.githubId);
    const now = new Date();
    if (existing) {
      existing.login = input.login;
      existing.email = input.email ?? existing.email;
      existing.name = input.name ?? existing.name;
      existing.avatarUrl = input.avatarUrl ?? existing.avatarUrl;
      if (input.role) existing.role = input.role;
      existing.lastLoginAt = now;
      return existing;
    }
    const record: UserRecord = {
      id: `usr_${randomUUID()}`,
      githubId: input.githubId,
      login: input.login,
      email: input.email ?? null,
      name: input.name ?? null,
      avatarUrl: input.avatarUrl ?? null,
      role: input.role ?? "MEMBER",
      suspendedAt: null,
      createdAt: now,
      lastLoginAt: now,
    };
    this.users.set(record.id, record);
    return record;
  }

  async findUserByGithubId(githubId: string): Promise<UserRecord | null> {
    for (const user of this.users.values()) {
      if (user.githubId === githubId) return user;
    }
    return null;
  }

  async getUser(id: string): Promise<UserRecord | null> {
    return this.users.get(id) ?? null;
  }

  async listUsers(): Promise<UserRecord[]> {
    return [...this.users.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async setUserSuspended(id: string, suspended: boolean): Promise<UserRecord | null> {
    const user = this.users.get(id);
    if (!user) return null;
    user.suspendedAt = suspended ? new Date() : null;
    return user;
  }

  async createKey(input: CreateApiKeyInput): Promise<ApiKeyRecord> {
    const record: ApiKeyRecord = {
      id: `key_${randomUUID()}`,
      name: input.name,
      hashedKey: input.hashedKey,
      prefix: input.prefix ?? "",
      scopes: input.scopes ?? ["mcp:read"],
      pinnedVersion: input.pinnedVersion ?? null,
      rateLimit: input.rateLimit ?? 60,
      expiresAt: input.expiresAt ?? null,
      revokedAt: null,
      revokedReason: null,
      createdAt: new Date(),
      lastUsedAt: null,
      lastUsedIp: null,
      ownerId: input.ownerId ?? null,
    };
    this.keys.set(record.id, record);
    return record;
  }

  async findKeyByHash(hashedKey: string): Promise<ApiKeyRecord | null> {
    for (const key of this.keys.values()) {
      if (key.hashedKey === hashedKey) return key;
    }
    return null;
  }

  async getKey(id: string): Promise<ApiKeyRecord | null> {
    return this.keys.get(id) ?? null;
  }

  async listKeys(): Promise<ApiKeyRecord[]> {
    return [...this.keys.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async listKeysByOwner(ownerId: string): Promise<ApiKeyRecord[]> {
    return [...this.keys.values()]
      .filter((key) => key.ownerId === ownerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async countActiveKeys(ownerId: string): Promise<number> {
    return [...this.keys.values()].filter((key) => key.ownerId === ownerId && !key.revokedAt).length;
  }

  async revokeKey(id: string, reason?: string): Promise<ApiKeyRecord | null> {
    const key = this.keys.get(id);
    if (!key) return null;
    key.revokedAt = new Date();
    key.revokedReason = reason ?? null;
    return key;
  }

  async touchKey(id: string, ip?: string): Promise<void> {
    const key = this.keys.get(id);
    if (!key) return;
    key.lastUsedAt = new Date();
    if (ip) key.lastUsedIp = ip;
  }

  async createSession(input: CreateSessionInput): Promise<SessionRecord> {
    const record: SessionRecord = {
      id: `ses_${randomUUID()}`,
      apiKeyId: input.apiKeyId,
      feature: input.feature,
      kbVersion: input.kbVersion,
      fetched: [],
      startedAt: new Date(),
    };
    this.sessions.set(record.id, record);
    return record;
  }

  async getSession(id: string): Promise<SessionRecord | null> {
    return this.sessions.get(id) ?? null;
  }

  async addFetched(sessionId: string, ids: string[]): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.fetched = [...new Set([...session.fetched, ...ids])];
  }

  async logUsage(input: UsageInput): Promise<UsageRecord> {
    const record: UsageRecord = {
      ...input,
      id: `use_${randomUUID()}`,
      createdAt: new Date(),
    };
    this.usageLog.push(record);
    return record;
  }

  async listUsage(apiKeyId?: string, limit = 100): Promise<UsageRecord[]> {
    return this.usageLog
      .filter((entry) => !apiKeyId || entry.apiKeyId === apiKeyId)
      .slice(-limit)
      .reverse();
  }

  async listUsageByOwner(ownerId: string, limit = 100): Promise<UsageRecord[]> {
    const owned = new Set(
      [...this.keys.values()].filter((key) => key.ownerId === ownerId).map((key) => key.id),
    );
    return this.usageLog
      .filter((entry) => owned.has(entry.apiKeyId))
      .slice(-limit)
      .reverse();
  }

  async saveCompliance(input: ComplianceInput): Promise<ComplianceRecord> {
    const record: ComplianceRecord = {
      ...input,
      id: `cmp_${randomUUID()}`,
      createdAt: new Date(),
    };
    this.compliance.push(record);
    return record;
  }

  async listCompliance(sessionId?: string, limit = 100): Promise<ComplianceRecord[]> {
    return this.compliance
      .filter((entry) => !sessionId || entry.sessionId === sessionId)
      .slice(-limit)
      .reverse();
  }

  async upsertGap(topic: string, context: string): Promise<GapRecord> {
    const existing = this.gaps.get(topic);
    if (existing) {
      existing.count += 1;
      existing.context = context;
      existing.updatedAt = new Date();
      return existing;
    }
    const record: GapRecord = {
      id: `gap_${randomUUID()}`,
      topic,
      context,
      count: 1,
      resolved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.gaps.set(topic, record);
    return record;
  }

  async listGaps(includeResolved = false): Promise<GapRecord[]> {
    return [...this.gaps.values()]
      .filter((gap) => includeResolved || !gap.resolved)
      .sort((a, b) => b.count - a.count);
  }

  async audit(input: AuditInput): Promise<AuditRecord> {
    const record: AuditRecord = {
      ...input,
      id: `aud_${randomUUID()}`,
      createdAt: new Date(),
    };
    this.auditLog.push(record);
    return record;
  }

  async listAudit(limit = 100): Promise<AuditRecord[]> {
    return this.auditLog.slice(-limit).reverse();
  }
}
