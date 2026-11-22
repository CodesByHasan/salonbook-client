"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, toActionResult } from "@/lib/api/fetcher";

// Pay Now: asks the API for a Stripe Checkout URL. The price is decided on the server.
export async function startCheckout(appointmentId) {
  const res = await apiFetch("/api/payments/create-checkout-session", {
    method: "POST",
    auth: true,
    body: { appointmentId },
  });

  return toActionResult(res, "Redirecting to secure checkout…");
}

// Used by /payment/success to wait for the webhook. Read-only.
export async function fetchSessionStatus(sessionId) {
  const res = await apiFetch(`/api/payments/session-status?session_id=${encodeURIComponent(sessionId)}`, {
    auth: true,
  });

  // The webhook finished: refresh the dashboards so they show "Paid".
  if (res.ok && res.data?.recorded && res.data?.appointmentPaymentStatus === "paid") {
    revalidatePath("/dashboard/customer", "layout");
    revalidatePath("/dashboard/admin/transactions");
  }

  return toActionResult(res, "Payment status loaded.");
}
