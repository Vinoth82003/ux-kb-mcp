import { NextResponse } from "next/server";
import { getKb } from "@/lib/kb";
import { guardApi } from "@/lib/api";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardApi(request, "doc.read");
  if (guard.response) return guard.response;

  const { id } = await params;
  const kb = getKb();
  const doc = kb.doc(id.toUpperCase());
  if (!doc) return NextResponse.json({ error: "Doc not found" }, { status: 404 });

  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "json";
  if (format === "markdown") {
    return new NextResponse(doc.body, {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "content-disposition": `attachment; filename="${doc.frontMatter.id}.md"`,
        "cache-control": "no-store",
      },
    });
  }
  return NextResponse.json(doc, { headers: { "cache-control": "no-store" } });
}
