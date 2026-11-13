import { getKb } from "@/lib/kb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const kb = getKb();
  return Response.json({ ok: true, service: "ux-kb", kbVersion: kb.version, docs: kb.docs().length });
}
