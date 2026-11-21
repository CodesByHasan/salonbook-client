import "server-only";
import { API_URL } from "@/lib/env";
import { getToken } from "@/lib/session";

const fail = (status, message) => ({ ok: false, status, message, data: null, meta: null, errors: null });

// One helper for every call to the Express API (server components + server actions).
// It never throws: callers check `ok`.
//
// Example: const res = await apiFetch("/api/appointments", { method: "POST", auth: true, body });
export async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
  const headers = { Accept: "application/json" };

  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = await getToken();
    if (!token) return fail(401, "Please sign in to continue.");
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const json = await res.json().catch(() => null);

    return {
      ok: res.ok,
      status: res.status,
      message: json?.message ?? "",
      data: json?.data ?? null,
      meta: json?.meta ?? null,
      errors: json?.errors ?? null,
    };
  } catch {
    return fail(503, "Could not reach the server. Please try again.");
  }
}