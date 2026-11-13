import NextAuth, { type NextAuthResult } from "next-auth";
import GitHub from "next-auth/providers/github";

const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const allowedLogins = (process.env.ALLOWED_GITHUB_LOGINS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut }: NextAuthResult = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const email = (user.email ?? "").toLowerCase();
      const login = ((profile as { login?: string } | null)?.login ?? "").toLowerCase();
      if (allowedEmails.length === 0 && allowedLogins.length === 0) return false;
      if (allowedEmails.length > 0 && allowedEmails.includes(email)) return true;
      if (allowedLogins.length > 0 && allowedLogins.includes(login)) return true;
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub ?? undefined;
      }
      return session;
    },
  },
  pages: { signIn: "/signin" },
});
