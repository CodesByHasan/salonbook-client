import { apiFetch } from "./fetcher";
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

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(res.message || "Could not load the service.");

  return res.data;
}