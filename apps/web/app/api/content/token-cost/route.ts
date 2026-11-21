import { NextResponse } from "next/server";
import { convertMarkdownToJson } from "@ux-kb/core";
import { requireUserForAction } from "@/lib/authz";

export async function POST(request: Request) {
  const user = await requireUserForAction();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { markdown?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const markdown = (body.markdown ?? "").trim();
  if (!markdown) return NextResponse.json({ error: "markdown required" }, { status: 400 });
  try {
    const doc = convertMarkdownToJson(markdown);
    return NextResponse.json({ tokenCost: doc.tokenCost, id: doc.id, title: doc.title });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
