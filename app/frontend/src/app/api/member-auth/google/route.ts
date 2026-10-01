import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1";

// Start the Google OAuth flow by forwarding the browser to the backend.
export async function GET() {
  return NextResponse.redirect(`${BACKEND_URL}/auth/google`);
}
