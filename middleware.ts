import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  const { pathname } = req.nextUrl;

  if (token) {
    // User is authenticated, redirect to /dashboard if not already there
    if (!pathname.startsWith("/dashboard")) {
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }
  } else {
    // User is not authenticated, allow only root "/"
    if (pathname !== "/") {
      const rootUrl = req.nextUrl.clone();
      rootUrl.pathname = "/";
      return NextResponse.redirect(rootUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/((?!_next|api|favicon.ico).*)"],
};
