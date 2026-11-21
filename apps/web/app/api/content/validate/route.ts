import { NextResponse } from "next/server";
import { convertMarkdownToJson, scanContent, estimateTokens } from "@ux-kb/core";
import { requireUserForAction } from "@/lib/authz";

export async function POST(request: Request) {
  const user = await requireUserForAction();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { markdown?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const markdown = (body.markdown ?? "").trim();
  if (!markdown) return NextResponse.json({ error: "markdown is required" }, { status: 400 });

  const checks: { name: string; passed: boolean; detail?: string }[] = [];
  let doc: any = null;
  try {
    doc = convertMarkdownToJson(markdown);
    checks.push({ name: "schema validity", passed: true });
  } catch (e) {
    checks.push({ name: "schema validity", passed: false, detail: e instanceof Error ? e.message : String(e) });
    return NextResponse.json({ checks, ok: false });
  }

  const findings = scanContent(markdown);
  checks.push({ name: "sanitizer", passed: findings.length === 0, detail: findings.length ? findings.map((f) => f.code).join(", ") : undefined });

  const fullCost = doc.tokenCost?.full ?? 0;
  checks.push({ name: "token budget (full ≤ 900)", passed: fullCost <= 900, detail: `${fullCost} tokens` });

  const missingVerify = (doc.checks ?? []).filter((c: any) => (c.severity === "blocker" || c.severity === "major") && !c.verify?.hint);
  checks.push({ name: "verify coverage (blocker/major)", passed: missingVerify.length === 0, detail: missingVerify.length ? missingVerify.map((c: any) => c.id).join(", ") : undefined });

  const ok = checks.every((c) => c.passed);
  return NextResponse.json({ checks, ok });
}
