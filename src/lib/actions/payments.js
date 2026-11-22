"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, toActionResult } from "@/lib/api/fetcher";

// Create Stripe Checkout Session.
export async function startCheckout(appointmentId) {
  if (!appointmentId) {
    return {
      success: false,
      message: "Appointment ID is required.",
    };
  }

  const res = await apiFetch("/api/payments/create-checkout-session", {
    method: "POST",
    auth: true,
    body: { appointmentId },
  });

  return toActionResult(res, "Redirecting to secure checkout...");
}

// Check Stripe payment and wait for webhook fulfillment.
export async function fetchSessionStatus(sessionId) {
  if (!sessionId) {
    return {
      success: false,
      message: "Payment session ID is missing.",
    };
  }

  const res = await apiFetch(
    `/api/payments/session-status?session_id=${encodeURIComponent(sessionId)}`,
    { auth: true }
  );

  if (
    res.ok &&
    res.data?.paymentStatus === "paid" &&
    res.data?.recorded === true &&
    res.data?.appointmentPaymentStatus === "paid"
  ) {
    revalidatePath("/dashboard/customer/appointments");
    revalidatePath("/dashboard/admin/transactions");
  }

  return toActionResult(res, "Payment status loaded.");
}
