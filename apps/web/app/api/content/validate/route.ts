import { NextResponse } from "next/server";
import { convertMarkdownToJson, scanContent } from "@ux-kb/core";
import { guardApi, readJsonBody } from "@/lib/api";

export async function POST(request: Request) {
  const guard = await guardApi(request, "doc.read", { mutating: true });
  if (guard.response) return guard.response;

  const parsed = await readJsonBody<{ markdown?: string }>(request);
  if (parsed.response) return parsed.response;
  const markdown = (parsed.data.markdown ?? "").trim();
  if (!markdown) {
    return NextResponse.json({ error: "markdown is required" }, { status: 400 });
  }

  const checks: { name: string; passed: boolean; detail?: string }[] = [];
  let doc: ReturnType<typeof convertMarkdownToJson>;
  try {
    doc = convertMarkdownToJson(markdown);
    checks.push({ name: "Schema validity", passed: true });
  } catch (error) {
    checks.push({
      name: "Schema validity",
      passed: false,
      detail: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ checks, ok: false });
  }

  const findings = scanContent(markdown);
  checks.push({
    name: "Content sanitizer",
    passed: findings.length === 0,
    detail: findings.length ? findings.map((finding) => finding.code).join(", ") : undefined,
  });

  const fullCost = doc.tokenCost?.full ?? 0;
  checks.push({
    name: "Token budget (full ≤ 900)",
    passed: fullCost <= 900,
    detail: `${fullCost} tokens`,
  });

  const missingVerify = (doc.checks ?? []).filter(
    (check) => (check.severity === "blocker" || check.severity === "major") && !check.verify?.hint,
  );
  checks.push({
    name: "Verify coverage (blocker/major)",
    passed: missingVerify.length === 0,
    detail: missingVerify.length ? missingVerify.map((check) => check.id).join(", ") : undefined,
  });

  const relatedMissingWhen = (doc.related ?? []).filter((related) => !related.when?.trim());
  checks.push({
    name: "Related links explain when to use them",
    passed: relatedMissingWhen.length === 0,
    detail: relatedMissingWhen.length
      ? relatedMissingWhen.map((related) => related.id).join(", ")
      : undefined,
  });

  const ok = checks.every((check) => check.passed);
  return NextResponse.json({ checks, ok, tokenCost: doc.tokenCost, id: doc.id });
}
