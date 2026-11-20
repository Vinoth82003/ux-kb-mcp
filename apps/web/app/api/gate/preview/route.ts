import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getKb } from "@/lib/kb";
import { startSession, startGate } from "@ux-kb/core";
import { requireUserForAction } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";

export async function POST(request: Request) {
  const user = await requireUserForAction();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { screenType?: string; components?: string[]; screen?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const screenType = body.screenType ?? "other";
  const components = body.components ?? [];
  const screen = (body.screen ?? "Preview").trim() || "Preview";

  try {
    const store = await getStore();
    const kb = getKb();
    const { session } = await startSession(store, kb.repo, {
      apiKeyId: user.id,
      kbVersion: kb.version,
      feature: `preview ${screenType}`,
      mode: "full",
    });
    const result = await startGate(store, kb.repo, session, {
      sessionId: session.id,
      screen,
      components,
      screenType: screenType as any,
      extraStates: [],
    });
    const estimatedTokens = (result.items ?? []).reduce((t, it: any) => t + 40, 0) + 40;
    await recordAudit({
      user,
      action: "gate.preview",
      target: screenType,
      metadata: { components, itemCount: result.items.length },
    });
    return NextResponse.json({ ...result, estimatedTokens });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }
}
