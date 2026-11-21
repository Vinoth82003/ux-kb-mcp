import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { requireUserForAction } from "@/lib/authz";

export async function GET() {
  const user = await requireUserForAction();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const store = await getStore();
  const entries = await store.listAudit(10000);
  return NextResponse.json({ entries });
}
