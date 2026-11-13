import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Defence in depth only. Every dashboard page and server action re-checks the
 * session server-side; this redirect just avoids rendering a broken shell.
 */
export default auth((req) => {
  if (req.nextUrl.pathname.startsWith("/dashboard") && !req.auth) {
    const url = new URL("/signin", req.nextUrl);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
