"use server";

import { apiFetch } from "@/lib/api/fetcher";
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
    body: { serviceId, date, timeSlot, ...(message && { notes: message }) },
  });

  if (!res.ok) {
    // The API calls the field "notes", the form calls it "message".
    const { notes, ...rest } = res.errors ?? {};
    return {
      success: false,
      message: res.message || "Could not book the appointment.",
      errors: res.errors ? { ...rest, ...(notes && { message: notes }) } : undefined,
    };
  }

  return { success: true, message: "Appointment requested! It stays pending until it is confirmed." };
}