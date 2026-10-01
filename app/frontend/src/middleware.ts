import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN_COOKIE = "gms_admin_token";
const USER_TOKEN_COOKIE = "gms_user_token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const adminToken = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  const userToken = req.cookies.get(USER_TOKEN_COOKIE)?.value;

  // Member portal (members, staff, trainers)
  if (pathname.startsWith("/portal")) {
    const isPublic = pathname === "/portal/login";

    if (!userToken && !isPublic) {
      const url = req.nextUrl.clone();
      url.pathname = "/portal/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (userToken && isPublic) {
      const url = req.nextUrl.clone();
      url.pathname = "/portal/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // Public auth pages — bounce already-authenticated users to their area
  if (
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname === "/auth/callback"
  ) {
    if (pathname !== "/auth/callback") {
      if (adminToken) {
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        url.search = "";
        return NextResponse.redirect(url);
      }

      if (userToken) {
        const url = req.nextUrl.clone();
        url.pathname = "/portal/dashboard";
        url.search = "";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  }

  // Everything else is the admin area
  if (!adminToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
