import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin") && role !== "ADMIN" && role !== "TEACHER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/dashboard") && !role) {
      return NextResponse.redirect(new URL("/connexion", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return Boolean(token);
        return true;
      }
    }
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
