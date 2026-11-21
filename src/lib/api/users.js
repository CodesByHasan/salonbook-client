import { apiFetch, assertOk } from "./fetcher";
import { buildQuery } from "@/lib/utils";

// Admin: user list. params: { page, limit }
export async function getUsers(params = {}) {
  const res = assertOk(
    await apiFetch(`/api/users?${buildQuery(params)}`, { auth: true }),
    "Could not load users.",
  );
  return { users: res.data ?? [], meta: res.meta };
}