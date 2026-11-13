import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  if (isDashboard && !isLoggedIn) {
    const url = new URL("/signin", req.nextUrl);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
