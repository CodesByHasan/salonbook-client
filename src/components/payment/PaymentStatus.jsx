"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { fetchSessionStatus } from "@/lib/actions/payments";
import { formatMoney } from "@/lib/utils";

const MAX_TRIES = 20;
const DELAY = 2000; // ms

// Stripe sends the customer here right after paying. The payment is saved by the Stripe webhook,
// which can take a few seconds, so we ask the API every 2 s until it is saved.
export default function PaymentStatus({ sessionId }) {
  const [state, setState] = useState({ phase: "checking" }); // checking | paid | waiting | unpaid | error
  const [round, setRound] = useState(0); // "Check again" starts a new round

  useEffect(() => {
    let cancelled = false;
    let timer;

    async function check(attempt) {
      const result = await fetchSessionStatus(sessionId);
      if (cancelled) return;

      if (!result.success) {
        setState({ phase: "error", message: result.message });
        return;
      }

      const { paymentStatus, recorded, appointmentPaymentStatus, amount, currency } = result.data;

      if (paymentStatus !== "paid") {
        setState({ phase: "unpaid" });
        return;
      }

      // The webhook saved the transaction AND marked the appointment paid.
      if (recorded && appointmentPaymentStatus === "paid") {
        setState({ phase: "paid", amount, currency });
        toast.success("Payment successful!");
        return;
      }

      if (attempt >= MAX_TRIES) {
        setState({ phase: "waiting", amount, currency });
        return;
      }

      timer = setTimeout(() => check(attempt + 1), DELAY);
    }

    setState({ phase: "checking" });
    check(1);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId, round]);

  const appointmentsLink = (
    <Link href="/dashboard/customer/appointments" className={buttonVariants({ size: "lg", className: "mt-6" })}>
      Go to my appointments
    </Link>
  );

  if (state.phase === "checking") {
    return (
      <div role="status" className="text-center">
        <Loader2 className="mx-auto size-14 animate-spin text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Confirming your payment…</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please do not close this page.</p>
      </div>
    );
  }

  if (state.phase === "paid") {
    return (
      <div className="text-center">
        <CircleCheck className="mx-auto size-16 text-green-600" />
        <h1 className="mt-4 text-2xl font-bold">Payment successful</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you! We received {formatMoney(state.amount, state.currency)}. Your appointment is now marked as paid.
        </p>
        {appointmentsLink}
      </div>
    );
  }

  if (state.phase === "waiting") {
    return (
      <div className="text-center">
        <CircleCheck className="mx-auto size-16 text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold">Payment received by Stripe</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We are still waiting for Stripe&apos;s confirmation. Your appointment will show as paid as soon as it arrives.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="outline" onClick={() => setRound((value) => value + 1)}>
            Check again
          </Button>
          {appointmentsLink}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <CircleX className="mx-auto size-16 text-destructive" />
      <h1 className="mt-4 text-2xl font-bold">
        {state.phase === "unpaid" ? "Payment not completed" : "Could not check the payment"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {state.phase === "unpaid" ? "No money was taken. You can try again from My Appointments." : state.message}
      </p>
      {appointmentsLink}
    </div>
  );
}
