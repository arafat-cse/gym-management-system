import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Lightweight check used by the portal login page to bounce already-authenticated users.
export async function GET() {
  const token = cookies().get("gms_user_token")?.value;
  return NextResponse.json({ authenticated: Boolean(token) });
}
