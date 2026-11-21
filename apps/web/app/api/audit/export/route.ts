import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { guardApi } from "@/lib/api";
import { recordAudit } from "@/lib/audit";

export async function GET(request: Request) {
  const guard = await guardApi(request, "user.manage");
  if (guard.response) return guard.response;

  const store = await getStore();
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 10000), 1), 50000);
  const entries = await store.listAudit(limit);

  await recordAudit({
    user: guard.user,
    action: "audit.export",
    target: "audit-log",
    metadata: { entries: entries.length },
  });

  return NextResponse.json(
    { exportedAt: new Date().toISOString(), entries },
    {
      headers: {
        "content-disposition": `attachment; filename="ux-kb-audit-${new Date().toISOString().slice(0, 10)}.json"`,
        "cache-control": "no-store",
      },
    },
  );
}
