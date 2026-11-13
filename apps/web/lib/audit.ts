import { headers } from "next/headers";
import type { UserRecord } from "@ux-kb/core/store";
import { getStore } from "./store";
import { clientIp } from "./request";

export interface AuditEvent {
  user?: UserRecord | null;
  actor?: string;
  action: string;
  target: string;
  metadata?: unknown;
}

/**
 * Write an audit row. Auditing must never break the request that produced it,
 * so failures are logged and swallowed.
 */
export async function recordAudit(event: AuditEvent): Promise<void> {
  try {
    const headerList = await headers();
    const store = await getStore();
    await store.audit({
      actor: event.actor ?? (event.user ? `github:${event.user.login}` : "anonymous"),
      actorUserId: event.user?.id ?? null,
      action: event.action,
      target: event.target,
      metadata: event.metadata,
      ip: clientIp(headerList),
      userAgent: headerList.get("user-agent"),
    });
  } catch (error) {
    console.error("audit.write_failed", {
      action: event.action,
      target: event.target,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
