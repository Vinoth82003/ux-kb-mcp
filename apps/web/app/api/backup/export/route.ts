import { NextResponse } from "next/server";
import { getKb } from "@/lib/kb";
import { guardApi } from "@/lib/api";
import { recordAudit } from "@/lib/audit";

export async function GET(request: Request) {
  const guard = await guardApi(request, "config.write", { stepUp: true });
  if (guard.response) return guard.response;

  const kb = getKb();
  const bundle = {
    version: kb.version,
    exportedAt: new Date().toISOString(),
    docs: kb.docs().map((doc) => ({
      id: doc.frontMatter.id,
      rev: doc.frontMatter.rev,
      body: doc.body,
    })),
    versionedDocs: kb.versionedDocs(),
  };
  await recordAudit({
    user: guard.user,
    action: "backup.export",
    target: "kb",
    metadata: { docCount: kb.docs().length },
  });
  return NextResponse.json(bundle, {
    headers: {
      "content-disposition": `attachment; filename="ux-kb-backup-${kb.version}.json"`,
      "cache-control": "no-store",
    },
  });
}
