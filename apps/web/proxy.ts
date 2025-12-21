import { NextRequest, NextResponse } from "next/server";

export const proxy = (req: NextRequest) => {
  const refreshToken = req.cookies.get("refresh_token");
  const { pathname } = req.nextUrl;

  // Allowing public routes + next internal assets
  if (pathname === "/login" || pathname.startsWith("/_next")) {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/dashboard", req?.url));
    }
    return NextResponse.next();
  }

  // Redirecting unauthenticated users
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req?.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
