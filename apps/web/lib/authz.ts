import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { UserRecord } from "@ux-kb/core/store";
import { getStore } from "./store";

/** Resolve the signed-in user from the session and re-read the database row. */
export async function getSessionUser(): Promise<UserRecord | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const store = await getStore();
  // `id` is the database id when the JWT was enriched at sign-in. Fall back to
  // the GitHub id (`token.sub`) so a token minted before an enrichment fix still
  // resolves instead of causing a redirect loop.
  const user = (await store.getUser(id)) ?? (await store.findUserByGithubId(id));
  if (!user || user.suspendedAt) return null;
  return user;
}

/** Page guard: redirects to /signin when unauthenticated or suspended. */
export async function requireUser(): Promise<UserRecord> {
  const user = await getSessionUser();
  if (!user) redirect("/signin");
  return user;
}

/** Page guard for admin-only surfaces. */
export async function requireAdmin(): Promise<UserRecord> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

/** Server-action guard: returns null instead of redirecting. */
export async function requireUserForAction(): Promise<UserRecord | null> {
  return getSessionUser();
}
