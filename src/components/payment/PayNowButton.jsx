"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { startCheckout } from "@/lib/actions/payments";

export default function PayNowButton({ appointmentId }) {
  const [isPending, startTransition] = useTransition();

  function handlePayment() {
    if (!appointmentId) {
      toast.error("Appointment information is missing.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await startCheckout(appointmentId);

        if (!result.success) {
          toast.error(result.message || "Could not start payment.");
          return;
        }

        // The updated server route returns { url: session.url }.
        const checkoutUrl =
          result.data?.url ||
          result.data?.checkoutUrl ||
          result.data?.redirectUrl;

        if (!checkoutUrl) {
          toast.error("Stripe Checkout URL was not returned by the server.");
          return;
        }

        toast.success("Redirecting to secure payment...");

        window.location.href = checkoutUrl;
      } catch (error) {
        console.error("Payment error:", error);
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Button
      type="button"
      onClick={handlePayment}
      disabled={isPending}
      className="w-full"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Connecting to Stripe...
        </>
      ) : (
        "Pay Now"
      )}
    </Button>
  );
}
