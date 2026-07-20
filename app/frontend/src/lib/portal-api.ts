import "server-only";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1";
const TOKEN_COOKIE = "gms_user_token";

export async function portalApi<T>(path: string, init?: RequestInit): Promise<T | null> {
  const token = cookies().get(TOKEN_COOKIE)?.value;

  if (!token) return null;

  const res = await fetch(`${BACKEND_URL}/user/${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return (await res.json()) as T;
}
