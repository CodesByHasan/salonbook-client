"use server";

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

// Used by /payment/success to wait for the webhook.
export async function fetchSessionStatus(sessionId) {
  const res = await apiFetch(`/api/payments/session-status?session_id=${encodeURIComponent(sessionId)}`, {
    auth: true,
  });
  return toActionResult(res, "Payment status loaded.");
}