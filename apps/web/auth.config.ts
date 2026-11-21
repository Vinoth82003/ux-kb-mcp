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
  // Auth.js prefixes cookies with __Secure- and marks them Secure in production.
  useSecureCookies: process.env.NODE_ENV === "production",
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
    // Admin sessions are deliberately short-lived; the JWT is refreshed every
    // 30 minutes while the user is active.
    maxAge: 8 * 60 * 60,
    updateAge: 30 * 60,
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Only same-origin destinations are allowed, which closes the open
      // redirect that a crafted callbackUrl would otherwise create.
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {
        /* fall through */
      }
      return `${baseUrl}/dashboard`;
    },
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
        (session.user as { mfaVerified?: boolean; mfaPending?: boolean; mfaEnabled?: boolean }).mfaVerified =
          Boolean(token.mfaVerified ?? true);
        (session.user as { mfaVerified?: boolean; mfaPending?: boolean; mfaEnabled?: boolean }).mfaPending =
          Boolean(token.mfaPending ?? false);
        (session.user as { mfaVerified?: boolean; mfaPending?: boolean; mfaEnabled?: boolean }).mfaEnabled =
          Boolean(token.mfaEnabled ?? false);
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
