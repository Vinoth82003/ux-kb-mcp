import { NextResponse } from "next/server";
import { guardApi, readJsonBody } from "@/lib/api";
import { recordAudit } from "@/lib/audit";

// Change requests are not persisted yet, so the queue is intentionally empty.
// The authorization path is real (and tested), which keeps the endpoint safe
// until a ChangeRequest table lands.
const changeRequests = new Map<
  string,
  { id: string; authorId: string; status: string; approvers: string[] }
>();

export async function POST(request: Request) {
  const guard = await guardApi(request, "doc.publish", { mutating: true, stepUp: true });
  if (guard.response) return guard.response;

  const parsed = await readJsonBody<{ changeRequestId?: string }>(request);
  if (parsed.response) return parsed.response;
  const id = (parsed.data.changeRequestId ?? "").trim();
  if (!id) return NextResponse.json({ error: "changeRequestId required" }, { status: 400 });

  const changeRequest = changeRequests.get(id);
  if (!changeRequest) {
    return NextResponse.json(
      { error: "No such change request. The review queue is not persisted in this deployment." },
      { status: 404 },
    );
  }

  if (changeRequest.authorId === guard.user.id) {
    return NextResponse.json(
      { error: "Self-approval is not allowed (four-eyes rule)." },
      { status: 403 },
    );
  }

  changeRequest.approvers.push(guard.user.id);
  changeRequest.status = "approved";
  await recordAudit({
    user: guard.user,
    action: "change.approve",
    target: id,
    metadata: { approver: guard.user.id },
  });
  return NextResponse.json({ ok: true, changeRequest });
}
