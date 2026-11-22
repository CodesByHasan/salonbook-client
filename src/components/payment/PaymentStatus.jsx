"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { fetchSessionStatus } from "@/lib/actions/payments";
import { formatMoney } from "@/lib/utils";

const MAX_TRIES = 30;
const DELAY = 2000;

export default function PaymentStatus({ sessionId }) {
  const router = useRouter();

  const [state, setState] = useState({
    phase: "checking",
  });

  useEffect(() => {
    let cancelled = false;
    let timer;

    async function checkPayment(attempt) {
      try {
        const result = await fetchSessionStatus(sessionId);

        if (cancelled) return;

        if (!result.success) {
          setState({
            phase: "error",
            message: result.message,
          });
          return;
        }

        const {
          paymentStatus,
          recorded,
          appointmentPaymentStatus,
          amount,
          currency,
        } = result.data;

        // Both database records must be updated.
        if (
          paymentStatus === "paid" &&
          recorded === true &&
          appointmentPaymentStatus === "paid"
        ) {
          setState({
            phase: "paid",
            amount,
            currency,
          });

          toast.success("Payment successful!");

          router.refresh();
          return;
        }

        // Give the Stripe webhook time to finish its database updates.
        if (attempt < MAX_TRIES) {
          setState({
            phase: "checking",
          });

          timer = setTimeout(
            () => checkPayment(attempt + 1),
            DELAY
          );

          return;
        }

        // Stripe says paid, but the server has not finished recording it.
        if (paymentStatus === "paid") {
          setState({
            phase: "processing",
            amount,
            currency,
          });
          return;
        }

        setState({
          phase: "unpaid",
        });
      } catch (error) {
        if (cancelled) return;

        setState({
          phase: "error",
          message: error.message || "Could not check payment status.",
        });
      }
    }

    checkPayment(1);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId, router]);

  const appointmentLink = (
    <Link
      href="/dashboard/customer/appointments"
      className={buttonVariants({
        size: "lg",
        className: "mt-6",
      })}
    >
      Go to my appointments
    </Link>
  );

  if (state.phase === "checking") {
    return (
      <div className="text-center" role="status">
        <Loader2 className="mx-auto size-14 animate-spin text-primary" />

        <h1 className="mt-4 text-2xl font-bold">
          Confirming your payment...
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Your payment is being verified. Please do not close this page.
        </p>
      </div>
    );
  }

  if (state.phase === "paid") {
    return (
      <div className="text-center">
        <CircleCheck className="mx-auto size-16 text-green-600" />

        <h1 className="mt-4 text-2xl font-bold">
          Payment successful!
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Thank you! We received{" "}
          {formatMoney(state.amount, state.currency)}.
          Your appointment is now marked as paid.
        </p>

        {appointmentLink}
      </div>
    );
  }

  if (state.phase === "processing") {
    return (
      <div className="text-center">
        <Loader2 className="mx-auto size-14 animate-spin text-primary" />

        <h1 className="mt-4 text-2xl font-bold">
          Payment received
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Stripe confirms your payment, but the server is still
          updating your appointment and transaction records.
          Please check your dashboard again shortly.
        </p>

        {appointmentLink}
      </div>
    );
  }

  return (
    <div className="text-center">
      <CircleX className="mx-auto size-16 text-destructive" />

      <h1 className="mt-4 text-2xl font-bold">
        {state.phase === "unpaid"
          ? "Payment not completed"
          : "Could not verify payment"}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {state.phase === "unpaid"
          ? "The payment was not confirmed. You can check your appointments and try again."
          : state.message}
      </p>

      {appointmentLink}
    </div>
  );
}
