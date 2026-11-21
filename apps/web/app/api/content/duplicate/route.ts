import { NextResponse } from "next/server";
import { getKb } from "@/lib/kb";
import { guardApi, readJsonBody } from "@/lib/api";
import { recordAudit } from "@/lib/audit";

/**
 * Prepare a duplicate. The content tree is read-only at runtime, so this
 * returns the source body for the "new document" editor instead of claiming a
 * database write. The audit entry records who requested the copy.
 */
export async function POST(request: Request) {
  const guard = await guardApi(request, "doc.write", { mutating: true });
  if (guard.response) return guard.response;

  const parsed = await readJsonBody<{ id?: string }>(request);
  if (parsed.response) return parsed.response;
  const id = (parsed.data.id ?? "").trim().toUpperCase();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const kb = getKb();
  const doc = kb.doc(id);
  if (!doc) return NextResponse.json({ error: "Doc not found" }, { status: 404 });

  const newId = `${id}-COPY`;
  await recordAudit({
    user: guard.user,
    action: "doc.duplicate_prepare",
    target: id,
    metadata: { suggestedId: newId },
  });
  return NextResponse.json({ ok: true, sourceId: id, suggestedId: newId, body: doc.body });
}
