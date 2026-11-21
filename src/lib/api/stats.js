import { apiFetch, assertOk } from "./fetcher";

export async function getAdminStats() {
  const res = assertOk(await apiFetch("/api/stats/admin", { auth: true }), "Could not load the overview.");
  return res.data;
}