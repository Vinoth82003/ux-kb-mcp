import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getKb } from "@/lib/kb";
import { startSession, startGate } from "@ux-kb/core";
import { guardApi, readJsonBody } from "@/lib/api";
import { recordAudit } from "@/lib/audit";

export async function POST(request: Request) {
  const guard = await guardApi(request, "doc.read", { mutating: true });
  if (guard.response) return guard.response;

  const parsed = await readJsonBody<{ screenType?: string; components?: string[]; screen?: string }>(request);
  if (parsed.response) return parsed.response;

  const screenType = parsed.data.screenType ?? "other";
  const components = Array.isArray(parsed.data.components) ? parsed.data.components.slice(0, 50) : [];
  const screen = (parsed.data.screen ?? "Preview").trim() || "Preview";

  try {
    const store = await getStore();
    const kb = getKb();
    const { session } = await startSession(store, kb.repo, {
      apiKeyId: `panel:${guard.user.id}`,
      kbVersion: kb.version,
      feature: `preview ${screenType}`,
      mode: "full",
    });
    const result = await startGate(store, kb.repo, session, {
      sessionId: session.id,
      screen,
      components,
      screenType: screenType as never,
      extraStates: [],
    });
    const estimatedTokens = (result.items ?? []).reduce((total: number) => total + 40, 0) + 40;
    await recordAudit({
      user: guard.user,
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
