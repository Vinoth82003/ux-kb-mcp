import { NextResponse } from "next/server";
import { convertMarkdownToJson } from "@ux-kb/core";
import { guardApi, readJsonBody } from "@/lib/api";

export async function POST(request: Request) {
  const guard = await guardApi(request, "doc.read", { mutating: true });
  if (guard.response) return guard.response;

  const parsed = await readJsonBody<{ markdown?: string }>(request);
  if (parsed.response) return parsed.response;
  const markdown = (parsed.data.markdown ?? "").trim();
  if (!markdown) {
    return NextResponse.json({ error: "markdown required" }, { status: 400 });
  }

  try {
    const doc = convertMarkdownToJson(markdown);
    return NextResponse.json({ tokenCost: doc.tokenCost, id: doc.id, title: doc.title });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }
}
