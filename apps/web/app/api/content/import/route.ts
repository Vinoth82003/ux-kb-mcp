import { NextResponse } from "next/server";
import { convertMarkdownToJson, scanContent } from "@ux-kb/core";
import { guardApi, readJsonBody } from "@/lib/api";
import { recordAudit } from "@/lib/audit";

/**
 * Convert v1 markdown to the v2 document shape and report what was parsed. The
 * content tree is read-only, so this is a dry run: nothing is persisted.
 */
export async function POST(request: Request) {
  const guard = await guardApi(request, "doc.write", { mutating: true });
  if (guard.response) return guard.response;

  const parsed = await readJsonBody<{ markdown?: string }>(request);
  if (parsed.response) return parsed.response;
  const markdown = (parsed.data.markdown ?? "").trim();
  if (!markdown) {
    return NextResponse.json({ error: "markdown is required" }, { status: 400 });
  }

  try {
    const doc = convertMarkdownToJson(markdown);
    const findings = scanContent(markdown);
    await recordAudit({
      user: guard.user,
      action: "content.import_preview",
      target: doc.id,
      metadata: { findings: findings.length },
    });
    return NextResponse.json({
      ok: true,
      persisted: false,
      document: doc,
      conversionReport: {
        id: doc.id,
        title: doc.title,
        parsedSections: Object.keys(doc.sections).filter((key) => {
          const value = (doc.sections as Record<string, unknown>)[key];
          return Array.isArray(value)
            ? value.length > 0
            : value && (typeof value === "string" ? value.length > 0 : true);
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
