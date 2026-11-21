import NextAuth, { type NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { getStore } from "./lib/store";

// Fail fast: never allow dev auth in production.
if (process.env.DEV_AUTH === "1" && process.env.NODE_ENV === "production") {
  throw new Error("DEV_AUTH=1 is not allowed in production.");
}

// The database enum is MEMBER | ADMIN. Dev logins mirror those two roles only;
// additional names would advertise capabilities the policy cannot grant.
const DEV_ROLES = ["member", "admin"] as const;
type DevRole = (typeof DEV_ROLES)[number];

function devRoleFromEmail(email: string): DevRole | null {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  return (DEV_ROLES as readonly string[]).includes(local) ? (local as DevRole) : null;
}

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
const devAuthEnabled = process.env.DEV_AUTH === "1" && process.env.NODE_ENV !== "production";

const providers = [
  ...authConfig.providers,
  ...(devAuthEnabled
    ? [
        Credentials({
          id: "dev",
          name: "Dev credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            const email = String(credentials?.email ?? "").trim().toLowerCase();
            const password = String(credentials?.password ?? "");
            const expected = process.env.DEV_PASSWORD ?? "dev";
            if (password !== expected) return null;
            const role = devRoleFromEmail(email);
            if (!role) return null;

            const store = await getStore();
            const githubId = `dev:${role}`;
            const dbUser = await store.upsertUser({
              githubId,
              login: role,
              email,
              name: `Dev ${role}`,
              avatarUrl: null,
              role: role === "admin" ? "ADMIN" : "MEMBER",
            });

            const enriched: {
              dbUserId: string;
              role: "MEMBER" | "ADMIN";
              login: string;
              email: string;
            } = {
              dbUserId: dbUser.id,
              role: dbUser.role,
              login: dbUser.login,
              email,
            };
            return enriched;
          },
        }),
      ]
    : []),
];

export const { handlers, auth, signIn, signOut }: NextAuthResult = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, profile, account }) {
      // The dev Credentials provider has no GitHub profile. Its `authorize`
      // callback already created the user and enriched the object with a DB id.
      if (account?.provider === "dev") {
        const dev = user as { dbUserId?: string; login?: string };
        return Boolean(dev.dbUserId && dev.login);
      }

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
  events: {
    // Audit sign-outs so the audit log can distinguish an intentional exit from
    // an expired or revoked session.
    async signOut(message) {
      const token = "token" in message ? message.token : null;
      const uid = token?.uid ?? token?.sub;
      if (!uid) return;
      try {
        const store = await getStore();
        await store.audit({
          actor: `github:${String(token?.login ?? uid)}`,
          actorUserId: String(uid),
          action: "auth.signout",
          target: String(uid),
        });
      } catch (error) {
        console.error("auth.signout_audit_failed", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
  },
});
