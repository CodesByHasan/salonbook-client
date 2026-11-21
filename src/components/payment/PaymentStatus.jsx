"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { fetchSessionStatus } from "@/lib/actions/payments";
import { formatMoney } from "@/lib/utils";

const MAX_TRIES = 8;
const DELAY = 1500; // ms

// Stripe redirects here right after paying, often before the webhook has run.
// We ask the API every 1.5 s until the webhook has saved the payment.
export default function PaymentStatus({ sessionId }) {
  const [state, setState] = useState({ phase: "checking" }); // checking | paid | processing | unpaid | error

  useEffect(() => {
    let cancelled = false;
    let timer;

    async function check(attempt) {
      const result = await fetchSessionStatus(sessionId);
      if (cancelled) return;

      if (!result.success) {
        setState({ phase: "error", message: result.message });
        toast.error(result.message);
        return;
      }

      const { paymentStatus, recorded, amount, currency } = result.data;

      if (paymentStatus !== "paid") {
        setState({ phase: "unpaid" });
        toast.error("Payment was not completed.");
        return;
      }

      if (recorded) {
        setState({ phase: "paid", amount, currency });
        toast.success("Payment successful!");
        return;
      }

      if (attempt >= MAX_TRIES) {
        setState({ phase: "processing", amount, currency });
        return;
      }

      timer = setTimeout(() => check(attempt + 1), DELAY);
    }

    check(1);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId]);

  const link = (
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

  if (state.phase === "paid" || state.phase === "processing") {
    const paid = state.phase === "paid";
    return (
      <div className="text-center">
        <CircleCheck className="mx-auto size-16 text-green-600" />
        <h1 className="mt-4 text-2xl font-bold">{paid ? "Payment successful" : "Payment received"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {paid
            ? `Thank you! We received ${formatMoney(state.amount, state.currency)}. Your appointment is now marked as paid.`
            : "Thank you! Your payment went through. Your appointment will show as paid in a moment."}
        </p>
        {link}
      </div>
    );
  }

  return (
    <div className="text-center">
      <CircleX className="mx-auto size-16 text-destructive" />
      <h1 className="mt-4 text-2xl font-bold">{state.phase === "unpaid" ? "Payment not completed" : "Could not check the payment"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {state.phase === "unpaid" ? "No money was taken. You can try again from My Appointments." : state.message}
      </p>
      {link}
    </div>
  );
}