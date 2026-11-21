import { apiFetch, assertOk } from "./fetcher";
import { buildQuery } from "@/lib/utils";

// Admin, read-only. params: { page, limit }
export async function getTransactions(params = {}) {
  const res = assertOk(
    await apiFetch(`/api/payments/transactions?${buildQuery(params)}`, { auth: true }),
    "Could not load transactions.",
  );
  return { transactions: res.data ?? [], meta: res.meta };
}