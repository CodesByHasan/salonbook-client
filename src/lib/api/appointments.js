import { apiFetch, assertOk } from "./fetcher";
import { buildQuery } from "@/lib/utils";

// Customer: own appointments, newest first.
export async function getMyAppointments() {
  const res = assertOk(await apiFetch("/api/appointments/my", { auth: true }), "Could not load your appointments.");
  return res.data ?? [];
}

// Admin: all appointments. params: { status, page, limit }
export async function getAdminAppointments(params = {}) {
  const res = assertOk(
    await apiFetch(`/api/appointments/admin?${buildQuery(params)}`, { auth: true }),
    "Could not load appointments.",
  );
  return { appointments: res.data ?? [], meta: res.meta };
}