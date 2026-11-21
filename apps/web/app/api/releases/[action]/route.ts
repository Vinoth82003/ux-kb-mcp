import { NextResponse } from "next/server";
import { guardApi } from "@/lib/api";

const KNOWN_ACTIONS = new Set(["stage", "promote", "rollback"]);

/**
 * Release state is owned by the deployment that ships the content tree. The
 * panel deliberately does not pretend to mutate it: a fake "success" here
 * would mislead operators about what is actually live.
 *
 * Set RELEASES_ENABLED=1 only after a release backend is wired up.
 */
export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const guard = await guardApi(request, "release.manage", { mutating: true, stepUp: true });
  if (guard.response) return guard.response;

  const { action } = await params;
  if (!KNOWN_ACTIONS.has(action)) {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  if (process.env.RELEASES_ENABLED !== "1") {
    return NextResponse.json(
      {
        error:
          "Release management is not enabled in this deployment. Deploy the content tree and update content/release.json instead.",
        code: "not_enabled",
      },
      { status: 501 },
    );
  }

  return NextResponse.json(
    { error: "No release backend is configured.", code: "not_implemented" },
    { status: 501 },
  );
}
