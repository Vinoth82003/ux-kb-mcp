import { NextResponse } from "next/server";
import { getKb } from "@/lib/kb";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";

export async function GET() {
  const user = await requireUserForAction();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const kb = getKb();
  const bundle = {
    version: kb.version,
    exportedAt: new Date().toISOString(),
    docs: kb.docs().map((d) => ({ id: d.frontMatter.id, rev: d.frontMatter.rev, body: d.body })),
    versionedDocs: kb.versionedDocs(),
  };
  await recordAudit({ user, action: "backup.export", target: "kb", metadata: { docCount: kb.docs().length } });
  return NextResponse.json(bundle);
}
