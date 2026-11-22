"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startCheckout } from "@/lib/actions/payments";

export default function PayNowButton({ appointmentId, className }) {
  const [isPending, startTransition] = useTransition();

  function handlePay() {
    startTransition(async () => {
      const result = await startCheckout(appointmentId);

      if (!result.success || !result.data?.url) {
        toast.error(result.message || "Could not start the payment.");
        return;
      }

      // Go to the Stripe Checkout page.
      window.location.href = result.data.url;
    });
  }

  return (
    <Button type="button" onClick={handlePay} disabled={isPending} className={className}>
      {isPending ? (
        <>
          <Loader2 className="animate-spin" /> Connecting to Stripe…
        </>
      ) : (
        "Pay Now"
      )}
    </Button>
  );
}
