"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, toActionResult } from "@/lib/api/fetcher";
import { bookingSchema } from "@/lib/validators/appointment";
import { getFieldErrors } from "@/lib/validators/common";

// Called from the booking form. The JWT is added on the server, never in the browser.
export async function createAppointment(input) {
  const parsed = bookingSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "Please fix the highlighted fields.", errors: getFieldErrors(parsed.error) };
  }

  const { serviceId, date, timeSlot, message } = parsed.data;

  const res = await apiFetch("/api/appointments", {
    method: "POST",
    auth: true,
    body: { serviceId, appointmentDate: date, timeSlot, ...(message && { message }) },
  });

  if (!res.ok) {
    // The API calls the field "appointmentDate", the form calls it "date".
    const { appointmentDate, ...rest } = res.errors ?? {};
    return {
      success: false,
      status: res.status,
      message: res.message || "Could not book the appointment.",
      errors: res.errors ? { ...rest, ...(appointmentDate && { date: appointmentDate }) } : undefined,
    };
  }

  revalidatePath("/dashboard/customer", "layout");
  return { success: true, message: "Appointment requested! It stays pending until it is confirmed." };
}

async function patch(path, message) {
  const res = await apiFetch(path, { method: "PATCH", auth: true });
  if (res.ok) revalidatePath("/dashboard", "layout");
  return toActionResult(res, message);
}

const enc = encodeURIComponent;

// Customer: own + pending only (enforced by the API).
export async function cancelMyAppointment(id) {
  return patch(`/api/appointments/${enc(id)}/cancel`, "Appointment cancelled.");
}

// Admin: pending only.
export async function confirmAppointment(id) {
  return patch(`/api/appointments/admin/${enc(id)}/confirm`, "Appointment confirmed.");
}

// Admin: pending or confirmed (not paid).
export async function adminCancelAppointment(id) {
  return patch(`/api/appointments/admin/${enc(id)}/cancel`, "Appointment cancelled.");
}