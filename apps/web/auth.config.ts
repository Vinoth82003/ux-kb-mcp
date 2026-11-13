import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * Edge-safe Auth.js config. No database imports: the proxy and the route
 * handlers can both load this module. The database-backed `signIn` callback
 * lives in `auth.ts`.
 */
export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const enriched = user as {
          dbUserId?: string;
          role?: "MEMBER" | "ADMIN";
          login?: string;
        };
        token.uid = enriched.dbUserId ?? token.sub;
        token.role = enriched.role ?? "MEMBER";
        token.login = enriched.login ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.uid ?? token.sub ?? "");
        session.user.role = (token.role as "MEMBER" | "ADMIN" | undefined) ?? "MEMBER";
        session.user.login = String(token.login ?? "");
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
