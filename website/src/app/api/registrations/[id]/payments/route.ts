import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const formData = await req.formData();

  const backendRes = await fetch(`${BACKEND_URL}/registrations/${params.id}/payments`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => null);
  return NextResponse.json(data, { status: backendRes.status });
}
