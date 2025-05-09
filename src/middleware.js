import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const restrictedRoutes = {
  1: ["/entryForm", "/admin-panel"],
  2: [],
  3: ["/createForm", "/extendForm", "/fundraisers", "/admin-panel"],
};

const publicApiRoutes = ["/logout", "/not-authorized", "/checkAgent"];
export function middleware(request) {
  const serverCookie = cookies().get("hopefuel-server");
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/api/") &&
    publicApiRoutes.includes(pathname) &&
    !serverCookie
  ) {
    return NextResponse.redirect(new URL("/not-authorized", request.url));
  }

  const currentRole = serverCookie
    ? JSON.parse(serverCookie.value).roleId
    : null;
  const isRestrictedRoute = restrictedRoutes[currentRole]?.some((route) =>
    pathname.startsWith(route)
  );

  if (isRestrictedRoute) {
    return NextResponse.redirect(new URL("/not-authorized", request.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
