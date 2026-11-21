import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Defence in depth only. Every dashboard page and server action re-checks the
 * session server-side; this redirect just avoids rendering a broken shell.
 */
export default auth((req) => {
  const path = req.nextUrl.pathname;
  if (path.startsWith("/dashboard") && !req.auth) {
    const url = new URL("/signin", req.nextUrl);
    url.searchParams.set("callbackUrl", path);
    return Response.redirect(url);
  }
  // A signed-in user has no reason to see the sign-in screen.
  if (path === "/signin" && req.auth) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
};
