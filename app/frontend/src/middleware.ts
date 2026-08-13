import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN_COOKIE = "gms_admin_token";
const USER_TOKEN_COOKIE = "gms_user_token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/portal")) {
    const isPublic = pathname === "/portal/login";
    const token = req.cookies.get(USER_TOKEN_COOKIE)?.value;

    if (!token && !isPublic) {
      const url = req.nextUrl.clone();
      url.pathname = "/portal/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (token && pathname === "/portal/login") {
      const url = req.nextUrl.clone();
      url.pathname = "/portal/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  const isPublic = pathname === "/login";
  const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (token && pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
