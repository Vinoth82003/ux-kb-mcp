import { NextResponse } from "next/server";
import { getKb } from "@/lib/kb";
import { requireUserForAction } from "@/lib/authz";

export async function GET(request: Request) {
  const user = await requireUserForAction();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const kb = getKb();
  const url = new URL(request.url);
  const since = url.searchParams.get("since") ?? "1.0.0";
  const ids = (url.searchParams.get("ids") ?? "").split(",").filter(Boolean);
  const { diffSince } = await import("@ux-kb/core");
  const result = diffSince(kb.repo, { sessionId: "admin", sinceVersion: since, ids: ids.length ? ids : ["CMP-001"] });
  return NextResponse.json(result);
}
