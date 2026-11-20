import { NextResponse } from "next/server";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const user = await requireUserForAction();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { action } = await params;
  if (!["stage", "promote", "rollback"].includes(action)) {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
  if (action === "rollback") {
    // Require a reason in body.
    let body: { reason?: string } = {};
    try { body = await request.json(); } catch { /* ignore */ }
    if (!body.reason || body.reason.trim().length < 5) {
      return NextResponse.json({ error: "Rollback requires a reason (≥5 chars)." }, { status: 400 });
    }
  }
  await recordAudit({ user, action: `release.${action}`, target: "release", metadata: { action } });
  return NextResponse.json({ ok: true, action });
}
