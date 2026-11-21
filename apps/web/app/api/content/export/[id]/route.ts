import { NextResponse } from "next/server";
import { getKb } from "@/lib/kb";
import { requireUserForAction } from "@/lib/authz";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserForAction();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const kb = getKb();
  const doc = kb.doc(id.toUpperCase());
  if (!doc) return NextResponse.json({ error: "Doc not found" }, { status: 404 });
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "json";
  if (format === "markdown") {
    return new NextResponse(doc.body, { headers: { "content-type": "text/markdown" } });
  }
  return NextResponse.json(doc);
}
