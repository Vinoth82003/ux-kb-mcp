import { NextResponse } from "next/server";
import { getKb } from "@/lib/kb";
import { guardApi } from "@/lib/api";
import { diffSince } from "@ux-kb/core";

export async function GET(request: Request) {
  const guard = await guardApi(request, "release.manage");
  if (guard.response) return guard.response;

  const url = new URL(request.url);
  const since = url.searchParams.get("since") ?? "1.0.0";
  const ids = (url.searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 50);
  if (ids.length === 0) {
    return NextResponse.json({ error: "ids is required (comma-separated doc IDs)." }, { status: 400 });
  }

  const kb = getKb();
  const result = diffSince(kb.repo, { sessionId: "admin", sinceVersion: since, ids });
  return NextResponse.json(result);
}
