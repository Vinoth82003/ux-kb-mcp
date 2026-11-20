import { NextResponse } from "next/server";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";

// In-memory change requests (demo). Replace with DB table in production.
const changeRequests = new Map<string, { id: string; authorId: string; status: string; approvers: string[] }>();

export async function POST(request: Request) {
  const user = await requireUserForAction();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { changeRequestId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const id = body.changeRequestId;
  if (!id) return NextResponse.json({ error: "changeRequestId required" }, { status: 400 });

  const cr = changeRequests.get(id);
  if (!cr) return NextResponse.json({ error: "Change request not found" }, { status: 404 });

  // Four-eyes rule: author cannot approve their own change.
  if (cr.authorId === user.id) {
    return NextResponse.json({ error: "Self-approval is not allowed (four-eyes rule)." }, { status: 403 });
  }

  cr.approvers.push(user.id);
  cr.status = "approved";
  await recordAudit({ user, action: "change.approve", target: id, metadata: { approver: user.id } });
  return NextResponse.json({ ok: true, changeRequest: cr });
}
