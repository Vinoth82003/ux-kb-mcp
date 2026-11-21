import { NextResponse } from "next/server";
import { getKb } from "@/lib/kb";
import { guardApi, readJsonBody } from "@/lib/api";

export async function POST(request: Request) {
  const guard = await guardApi(request, "doc.read", { mutating: true });
  if (guard.response) return guard.response;

  const parsed = await readJsonBody<{ feature?: string }>(request);
  if (parsed.response) return parsed.response;
  const feature = (parsed.data.feature ?? "").trim();
  if (!feature) return NextResponse.json({ error: "feature required" }, { status: 400 });

  const kb = getKb();
  const routed = kb.routeFeature(feature);
  const routes = kb.repo
    .routes()
    .filter((route) => route.match.some((match) => feature.toLowerCase().includes(match.toLowerCase())));
  const tags = routes
    .flatMap((route) => route.match)
    .filter((tag, index, all) => all.indexOf(tag) === index);

  return NextResponse.json({
    feature,
    tags,
    routedDocIds: routed,
    matchedRules: routes.length,
  });
}
