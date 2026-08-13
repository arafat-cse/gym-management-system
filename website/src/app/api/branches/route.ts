import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1";

export async function GET() {
  const backendRes = await fetch(`${BACKEND_URL}/branches`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => null);
  return NextResponse.json(data, { status: backendRes.status });
}
