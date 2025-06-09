import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AGENT_ROLE } from "./lib/constants";

const restrictedRoutes = {
  1: ["/admin-panel"],
  2: [],
  3: ["/createForm", "/extendForm", "/fundraisers", "/admin-panel"],
};

const publicApiRoutes = ["/checkAgent"];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const serverCookie = cookies().get("hopefuel-server");

  let verifiedToken = null;

  if (serverCookie) {
    try {
      verifiedToken = await jwtVerify(serverCookie.value, JWT_SECRET);
    } catch (error) {
      console.error("JWT verification failed:", error);
    }
  }

  const pathname = request.nextUrl.pathname;

  const isPublicApi = publicApiRoutes.some((route) =>
    pathname.startsWith(`/api${route}`)
  );

  if (pathname.startsWith("/api/") && !isPublicApi && !verifiedToken) {
    return NextResponse.json(
      { message: "Agent not authenticated" },
      { status: 401 }
    );
  }

  const currentRole = verifiedToken ? verifiedToken.payload.roleId : null;

  if (currentRole === AGENT_ROLE.PAYMENT_PROCESSOR && pathname === "/") {
    return NextResponse.redirect(new URL("/entryForm", request.url));
  }

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
