import { NextResponse } from "next/server";
import { getKb } from "@/lib/kb";
import { requireUserForAction } from "@/lib/authz";

export async function POST(request: Request) {
  const user = await requireUserForAction();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { feature?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const feature = (body.feature ?? "").trim();
  if (!feature) return NextResponse.json({ error: "feature required" }, { status: 400 });
  const kb = getKb();
  const routed = kb.routeFeature(feature);
  const routes = kb.repo.routes().filter((r) => r.match.some((m) => feature.toLowerCase().includes(m.toLowerCase())));
  const tags = routes.flatMap((r) => r.match).filter((t, i, a) => a.indexOf(t) === i);
  return NextResponse.json({ feature, tags, routedDocIds: routed, matchedRules: routes.length });
}
