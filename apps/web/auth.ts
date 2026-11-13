import NextAuth, { type NextAuthResult } from "next-auth";
import { authConfig } from "./auth.config";
import { getStore } from "./lib/store";

function adminLogins(): Set<string> {
  return new Set(
    (process.env.ALLOWED_GITHUB_LOGINS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Full Auth.js instance with the database-backed sign-in callback.
 *
 * Policy: any GitHub identity may sign in and receive a quota-limited API key.
 * Logins listed in ALLOWED_GITHUB_LOGINS become admins. Suspended accounts are
 * rejected at the door.
 */
export const { handlers, auth, signIn, signOut }: NextAuthResult = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, profile, account }) {
      const gh = profile as
        | { id?: number | string; login?: string; name?: string; email?: string; avatar_url?: string }
        | null;

      const githubId = String(gh?.id ?? account?.providerAccountId ?? "");
      const login = (gh?.login ?? "").toLowerCase();
      if (!githubId || !login) return false;

      let store: Awaited<ReturnType<typeof getStore>>;
      try {
        store = await getStore();
      } catch (error) {
        console.error("auth.store_unavailable", {
          error: error instanceof Error ? error.message : String(error),
        });
        return false;
      }

      const existing = await store.findUserByGithubId(githubId);
      if (existing?.suspendedAt) {
        await store
          .audit({
            actor: `github:${login}`,
            action: "auth.denied",
            target: githubId,
            metadata: { reason: "suspended" },
          })
          .catch(() => undefined);
        return false;
      }

      const role = adminLogins().has(login) ? "ADMIN" : "MEMBER";
      let dbUser: Awaited<ReturnType<typeof store.upsertUser>>;
      try {
        dbUser = await store.upsertUser({
          githubId,
          login,
          email: gh?.email ?? user.email ?? null,
          name: gh?.name ?? user.name ?? null,
          avatarUrl: gh?.avatar_url ?? null,
          role,
        });
      } catch (error) {
        // A unique-constraint race or a database outage must not surface as a 500.
        console.error("auth.upsert_failed", {
          login,
          error: error instanceof Error ? error.message : String(error),
        });
        return false;
      }

      await store
        .audit({
          actor: `github:${login}`,
          actorUserId: dbUser.id,
          action: "auth.signin",
          target: dbUser.id,
          metadata: { role: dbUser.role },
        })
        .catch(() => undefined);

      // Carried into the `jwt` callback so the token gets the database id.
      const enriched = user as {
        dbUserId?: string;
        role?: "MEMBER" | "ADMIN";
        login?: string;
      };
      enriched.dbUserId = dbUser.id;
      enriched.role = dbUser.role;
      enriched.login = dbUser.login;
      return true;
    },
  },
});
