import { randomUUID } from "node:crypto";
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

/** In-memory store for tests and single-process local development. */
export class MemoryStore implements KbStore {
  private readonly keys = new Map<string, ApiKeyRecord>();
  private readonly sessions = new Map<string, SessionRecord>();
  private readonly compliance: ComplianceRecord[] = [];
  private readonly gaps = new Map<string, GapRecord>();
  readonly usageLog: UsageRecord[] = [];

  async createKey(input: CreateApiKeyInput): Promise<ApiKeyRecord> {
    const record: ApiKeyRecord = {
      id: `key_${randomUUID()}`,
      name: input.name,
      hashedKey: input.hashedKey,
      pinnedVersion: input.pinnedVersion ?? null,
      rateLimit: input.rateLimit ?? 120,
      revokedAt: null,
      createdAt: new Date(),
      lastUsedAt: null,
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

  async revokeKey(id: string): Promise<ApiKeyRecord | null> {
    const key = this.keys.get(id);
    if (!key) return null;
    key.revokedAt = new Date();
    return key;
  }

  async touchKey(id: string): Promise<void> {
    const key = this.keys.get(id);
    if (key) key.lastUsedAt = new Date();
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
}
