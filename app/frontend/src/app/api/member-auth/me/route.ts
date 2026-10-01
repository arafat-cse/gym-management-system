import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1";

// Proxy the member's account + registration status to the client.
export async function GET() {
  const token = cookies().get("gms_user_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const backendRes = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => null);

  if (!backendRes.ok) {
    return NextResponse.json(
      data ?? { message: "Could not load your account." },
      { status: backendRes.status },
    );
  }

  return NextResponse.json(data);
}
