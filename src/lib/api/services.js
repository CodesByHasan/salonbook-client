import { apiFetch, assertOk } from "./fetcher";
import { buildQuery } from "@/lib/utils";

// Public list (active services only).
// params: { search, category, sort: "asc" | "desc", page, limit }
export async function getServices(params = {}) {
  const res = await apiFetch(`/api/services?${buildQuery(params)}`);

  if (!res.ok) throw new Error(res.message || "Could not load services.");

  return { services: res.data ?? [], meta: res.meta };
}

// One service. Returns null when the id is invalid or the service does not exist.
export async function getServiceById(id) {
  const res = await apiFetch(`/api/services/${encodeURIComponent(id)}`);

  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(res.message || "Could not load the service.");

  return res.data;
}

// Admin: all services (active and inactive).
export async function getManageServices(params = {}) {
  const res = assertOk(
    await apiFetch(`/api/services/manage?${buildQuery(params)}`, { auth: true }),
    "Could not load services.",
  );
  return { services: res.data ?? [], meta: res.meta };
}