export interface ApiKeyRecord {
  id: string;
  name: string;
  hashedKey: string;
  pinnedVersion: string | null;
  rateLimit: number;
  revokedAt: Date | null;
  createdAt: Date;
  lastUsedAt: Date | null;
}

export interface CreateApiKeyInput {
  name: string;
  hashedKey: string;
  pinnedVersion?: string | null;
  rateLimit?: number;
}

export interface SessionRecord {
  id: string;
  apiKeyId: string;
  feature: string;
  kbVersion: string;
  fetched: string[];
  startedAt: Date;
}

export interface CreateSessionInput {
  apiKeyId: string;
  feature: string;
  kbVersion: string;
}

export interface UsageInput {
  apiKeyId: string;
  sessionId?: string | null;
  tool: string;
  args: unknown;
  latencyMs: number;
  ok: boolean;
}

export interface UsageRecord extends UsageInput {
  id: string;
  createdAt: Date;
}

export interface ComplianceInput {
  sessionId: string;
  citedIds: string[];
  unfetched: string[];
  unknown: string[];
}

export interface ComplianceRecord extends ComplianceInput {
  id: string;
  createdAt: Date;
}

export interface GapRecord {
  id: string;
  topic: string;
  context: string;
  count: number;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Persistence boundary for access control and observability.
 *
 * Implementations: MemoryStore (tests, local dev) and PrismaStore (Postgres).
 * Core services depend only on this interface so Phase 4+ can reuse them.
 */
export interface KbStore {
  createKey(input: CreateApiKeyInput): Promise<ApiKeyRecord>;
  findKeyByHash(hashedKey: string): Promise<ApiKeyRecord | null>;
  getKey(id: string): Promise<ApiKeyRecord | null>;
  listKeys(): Promise<ApiKeyRecord[]>;
  revokeKey(id: string): Promise<ApiKeyRecord | null>;
  touchKey(id: string): Promise<void>;

  createSession(input: CreateSessionInput): Promise<SessionRecord>;
  getSession(id: string): Promise<SessionRecord | null>;
  addFetched(sessionId: string, ids: string[]): Promise<void>;

  logUsage(input: UsageInput): Promise<UsageRecord>;
  listUsage(apiKeyId?: string, limit?: number): Promise<UsageRecord[]>;

  saveCompliance(input: ComplianceInput): Promise<ComplianceRecord>;
  listCompliance(sessionId?: string, limit?: number): Promise<ComplianceRecord[]>;

  upsertGap(topic: string, context: string): Promise<GapRecord>;
  listGaps(includeResolved?: boolean): Promise<GapRecord[]>;
}
