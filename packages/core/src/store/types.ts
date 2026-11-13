export type UserRole = "MEMBER" | "ADMIN";

export interface UserRecord {
  id: string;
  githubId: string;
  login: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  suspendedAt: Date | null;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export interface UpsertUserInput {
  githubId: string;
  login: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  role?: UserRole;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  hashedKey: string;
  /** Display-safe fragment such as "uxkb_AbCdEf". Never enough to authenticate. */
  prefix: string;
  scopes: string[];
  pinnedVersion: string | null;
  rateLimit: number;
  expiresAt: Date | null;
  revokedAt: Date | null;
  revokedReason: string | null;
  createdAt: Date;
  lastUsedAt: Date | null;
  lastUsedIp: string | null;
  ownerId: string | null;
}

export interface CreateApiKeyInput {
  name: string;
  hashedKey: string;
  prefix?: string;
  scopes?: string[];
  pinnedVersion?: string | null;
  rateLimit?: number;
  expiresAt?: Date | null;
  ownerId?: string | null;
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

export interface AuditInput {
  /** Human-readable actor label, e.g. "github:Vinoth82003". */
  actor: string;
  actorUserId?: string | null;
  action: string;
  target: string;
  metadata?: unknown;
  ip?: string | null;
  userAgent?: string | null;
}

export interface AuditRecord extends AuditInput {
  id: string;
  createdAt: Date;
}

/**
 * Persistence boundary for access control and observability.
 *
 * Implementations: MemoryStore (tests, local dev) and PrismaStore (Postgres).
 * Core services depend only on this interface so transports stay thin.
 */
export interface KbStore {
  // --- users ---------------------------------------------------------------
  upsertUser(input: UpsertUserInput): Promise<UserRecord>;
  findUserByGithubId(githubId: string): Promise<UserRecord | null>;
  getUser(id: string): Promise<UserRecord | null>;
  listUsers(): Promise<UserRecord[]>;
  setUserSuspended(id: string, suspended: boolean): Promise<UserRecord | null>;

  // --- API keys ------------------------------------------------------------
  createKey(input: CreateApiKeyInput): Promise<ApiKeyRecord>;
  findKeyByHash(hashedKey: string): Promise<ApiKeyRecord | null>;
  getKey(id: string): Promise<ApiKeyRecord | null>;
  listKeys(): Promise<ApiKeyRecord[]>;
  listKeysByOwner(ownerId: string): Promise<ApiKeyRecord[]>;
  countActiveKeys(ownerId: string): Promise<number>;
  revokeKey(id: string, reason?: string): Promise<ApiKeyRecord | null>;
  touchKey(id: string, ip?: string): Promise<void>;

  // --- sessions ------------------------------------------------------------
  createSession(input: CreateSessionInput): Promise<SessionRecord>;
  getSession(id: string): Promise<SessionRecord | null>;
  addFetched(sessionId: string, ids: string[]): Promise<void>;

  // --- usage ---------------------------------------------------------------
  logUsage(input: UsageInput): Promise<UsageRecord>;
  listUsage(apiKeyId?: string, limit?: number): Promise<UsageRecord[]>;
  listUsageByOwner(ownerId: string, limit?: number): Promise<UsageRecord[]>;

  // --- compliance ----------------------------------------------------------
  saveCompliance(input: ComplianceInput): Promise<ComplianceRecord>;
  listCompliance(sessionId?: string, limit?: number): Promise<ComplianceRecord[]>;

  // --- gaps ----------------------------------------------------------------
  upsertGap(topic: string, context: string): Promise<GapRecord>;
  listGaps(includeResolved?: boolean): Promise<GapRecord[]>;

  // --- audit ---------------------------------------------------------------
  audit(input: AuditInput): Promise<AuditRecord>;
  listAudit(limit?: number): Promise<AuditRecord[]>;
}
