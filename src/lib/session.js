import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { API_URL } from "@/lib/env";

// Forward the browser's cookies to the Express server's Better Auth.
async function getCookie() {
  return (await headers()).get("cookie") ?? "";
}

async function authGet(path) {
  const cookie = await getCookie();
  if (!cookie) return null;

  try {
    const res = await fetch(`${API_URL}/api/auth/${path}`, { headers: { cookie }, cache: "no-store" });
    if (!res.ok) return null;
    return await res.json().catch(() => null);
  } catch {
    return null;
  }
}

// Current session: { user, session } or null. Cached for one request.
export const getSession = cache(async () => {
  const data = await authGet("get-session");
  return data?.user ? data : null;
});

// Short-lived JWT for calling protected Express routes. Cached for one request.
export const getToken = cache(async () => (await authGet("token"))?.token ?? null);