// Beskyt dashboard-ruter (kun tjek for token – rolle-check kan ske i layout)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.startsWith("/(teacher)/dashboard")) {
    const hasToken =
      req.cookies.get("sb-access-token")?.value || req.cookies.get("supabase-auth-token")?.value;
    if (!hasToken) return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
