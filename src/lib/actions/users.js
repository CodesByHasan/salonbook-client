"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, toActionResult } from "@/lib/api/fetcher";
import { profileSchema } from "@/lib/validators/profile";
import { getFieldErrors } from "@/lib/validators/common";

// Own profile. The body is built field by field: role / blocked can never be sent from here.
export async function updateProfile(input) {
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "Please fix the highlighted fields.", errors: getFieldErrors(parsed.error) };
  }

  const { name, phone, image } = parsed.data;

  const res = await apiFetch("/api/users/me", {
    method: "PATCH",
    auth: true,
    body: { name, ...(phone && { phone }), ...(image && { image }) },
  });

  if (res.ok) revalidatePath("/", "layout"); // the Navbar shows name and image
  return toActionResult(res, "Profile updated.");
}

// Admin only (enforced by the API).
export async function setUserBlocked(userId, blocked) {
  const res = await apiFetch(`/api/users/${encodeURIComponent(userId)}/${blocked ? "block" : "unblock"}`, {
    method: "PATCH",
    auth: true,
  });
  if (res.ok) revalidatePath("/dashboard/admin/users");
  return toActionResult(res, blocked ? "User blocked." : "User unblocked.");
}