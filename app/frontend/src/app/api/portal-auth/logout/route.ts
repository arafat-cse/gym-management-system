import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1";
const TOKEN_COOKIE = "gms_user_token";

export async function POST() {
  const token = cookies().get(TOKEN_COOKIE)?.value;

  if (token) {
    await fetch(`${BACKEND_URL}/user/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    }).catch(() => null);
  }

  cookies().delete(TOKEN_COOKIE);
  return NextResponse.json({ success: true });
}
