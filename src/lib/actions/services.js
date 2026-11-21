"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, toActionResult } from "@/lib/api/fetcher";
import { serviceFormSchema } from "@/lib/validators/service";
import { getFieldErrors } from "@/lib/validators/common";

function refresh() {
  ["/dashboard/admin", "/dashboard/admin/services", "/services", "/"].forEach((path) => revalidatePath(path));
}

async function save(path, method, input, message) {
  const parsed = serviceFormSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "Please fix the highlighted fields.", errors: getFieldErrors(parsed.error) };
  }

  const res = await apiFetch(path, { method, auth: true, body: parsed.data });
  if (res.ok) refresh();
  return toActionResult(res, message);
}

export async function createService(input) {
  return save("/api/services", "POST", input, "Service added.");
}

export async function updateService(id, input) {
  return save(`/api/services/${encodeURIComponent(id)}`, "PATCH", input, "Service updated.");
}

export async function deleteService(id) {
  const res = await apiFetch(`/api/services/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
  if (res.ok) refresh();
  return toActionResult(res, "Service deleted.");
}