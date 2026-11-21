import { NextResponse } from "next/server";
import { getKb } from "@/lib/kb";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";

export async function POST(request: Request) {
  const user = await requireUserForAction();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { id?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const id = (body.id ?? "").trim().toUpperCase();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const kb = getKb();
  const doc = kb.doc(id);
  if (!doc) return NextResponse.json({ error: "Doc not found" }, { status: 404 });
  const newId = `${id}-COPY`;
  await recordAudit({ user, action: "doc.duplicate", target: id, metadata: { newId } });
  return NextResponse.json({ ok: true, sourceId: id, newId, body: doc.body });
}
