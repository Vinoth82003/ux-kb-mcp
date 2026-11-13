import { getLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily maintenance: drop rate-limit windows older than two days. Vercel Cron
 * sends `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const removed = await getLimiter().prune();
    return Response.json({ ok: true, removed });
  } catch (error) {
    console.error("cron.cleanup_failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ ok: false }, { status: 500 });
  }
}
