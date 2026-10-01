import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "gms_user_token";

// Store the token handed back by the backend OAuth callback as a session cookie.
export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({ token: null }));

  if (!token || typeof token !== "string") {
    return NextResponse.json({ message: "Missing token." }, { status: 400 });
  }

  cookies().set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete(TOKEN_COOKIE);
  return NextResponse.json({ ok: true });
}
