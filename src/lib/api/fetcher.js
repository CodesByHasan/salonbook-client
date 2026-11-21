import "server-only";
import { redirect, unstable_rethrow } from "next/navigation";
import { API_URL } from "@/lib/env";
import { getToken } from "@/lib/session";

const fail = (status, message) => ({ ok: false, status, message, data: null, meta: null, errors: null });

// One helper for every call to the Express API (server components + server actions).

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

// For list loaders: 401 -> sign-in page, any other failure -> Error with the API message
// (403 included, e.g. "Your account has been blocked").
export function assertOk(res, fallback = "Something went wrong. Please try again.") {
  if (res.ok) return res;
  if (res.status === 401) redirect("/sign-in?redirect=/dashboard");
  throw new Error(res.message || fallback);
}

// For server components: returns { data, error } instead of crashing the page,
// so the page can show <LoadError /> (toast + retry). Next production hides thrown messages.
export async function loadData(loader) {
  try {
    return { data: await loader(), error: null };
  } catch (error) {
    unstable_rethrow(error); // let redirect()/notFound() through
    return { data: null, error: error?.message || "Something went wrong. Please try again." };
  }
}

// Shape returned by server actions to client components.
export const toActionResult = (res, successMessage) =>
  res.ok
    ? { success: true, message: successMessage, data: res.data }
    : {
        success: false,
        status: res.status,
        message: res.message || "Something went wrong. Please try again.",
        errors: res.errors ?? undefined,
      };