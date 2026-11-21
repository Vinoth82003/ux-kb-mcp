import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Defence in depth only. Every dashboard page and server action re-checks the
 * session server-side; this redirect just avoids rendering a broken shell.
 */
export default auth((req) => {
  const path = req.nextUrl.pathname;
  const authed = Boolean(req.auth);

  if (path.startsWith("/dashboard")) {
    if (!authed) {
      const url = new URL("/signin", req.nextUrl);
      url.searchParams.set("callbackUrl", path);
      return Response.redirect(url);
    }
    if (req.auth?.user?.role !== "ADMIN") {
      return Response.redirect(new URL("/member", req.nextUrl));
    }
  }

  if (path.startsWith("/member")) {
    if (!authed) {
      const url = new URL("/signin", req.nextUrl);
      url.searchParams.set("callbackUrl", path);
      return Response.redirect(url);
    }
    if (req.auth?.user?.role === "ADMIN") {
      return Response.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  if (path === "/signin" && authed) {
    const destination = req.auth?.user?.role === "ADMIN" ? "/dashboard" : "/member";
    return Response.redirect(new URL(destination, req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/member/:path*", "/signin"],
};
