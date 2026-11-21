import { NextResponse } from "next/server";
import { convertMarkdownToJson, lintDoc, scanContent } from "@ux-kb/core";
import { getKb } from "@/lib/kb";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";

export async function POST(request: Request) {
  const user = await requireUserForAction();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { markdown?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const markdown = (body.markdown ?? "").trim();
  if (!markdown) {
    return NextResponse.json({ error: "markdown is required" }, { status: 400 });
  }

  try {
    const kb = getKb();
    const doc = convertMarkdownToJson(markdown);
    const findings = scanContent(markdown);
    await recordAudit({
      user,
      action: "content.import",
      target: doc.id,
      metadata: { findings: findings.length },
    });
    return NextResponse.json({
      ok: true,
      document: doc,
      conversionReport: {
        id: doc.id,
        title: doc.title,
        parsedSections: Object.keys(doc.sections).filter((k) => {
          const v = (doc.sections as any)[k];
          return Array.isArray(v) ? v.length > 0 : v && (typeof v === "string" ? v.length > 0 : true);
        }),
        checks: doc.checks.length,
        sanitizerFindings: findings,
        tokenCost: doc.tokenCost,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }
}
