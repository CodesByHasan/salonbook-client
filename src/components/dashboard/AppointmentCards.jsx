"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarX2, CreditCard, Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import DetailList from "@/components/shared/DetailList";
import EmptyState from "@/components/shared/EmptyState";

import {
  AppointmentStatusBadge,
  PaymentBadge,
} from "@/components/shared/StatusBadge";

import { cancelMyAppointment } from "@/lib/actions/appointments";
import { startCheckout } from "@/lib/actions/payments";

import { getCategoryLabel } from "@/lib/constants";
import { notify } from "@/lib/notify";

import {
  formatDate,
  formatDateTime,
  formatPrice,
  formatSlot,
} from "@/lib/utils";

export default function AppointmentCards({ appointments = [] }) {
  const router = useRouter();

  const [details, setDetails] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const [isPending, startTransition] = useTransition();

  // Cancel appointment.
  function handleCancel() {
    if (!cancelTarget) return;

    const target = cancelTarget;

    startTransition(async () => {
      try {
        const result = await cancelMyAppointment(target._id);

        notify(result, router);

        if (result.success) {
          setCancelTarget(null);
          router.refresh();
        }
      } catch (error) {
        console.error("Cancel appointment error:", error);
        notify(
          {
            success: false,
            message: "Could not cancel appointment. Please try again.",
          },
          router
        );
      }
    });
  }

  // Start Stripe Checkout.
  function handlePay(appointment) {
    if (!appointment?._id || payingId || isPending) return;

    setPayingId(appointment._id);

    startTransition(async () => {
      try {
        const result = await startCheckout(appointment._id);

        if (!result.success) {
          notify(result, router);
          setPayingId(null);
          return;
        }

        const checkoutUrl = result.data?.url;

        if (!checkoutUrl) {
          notify(
            {
              success: false,
              message: "Stripe Checkout URL was not returned.",
            },
            router
          );

          setPayingId(null);
          return;
        }

        // Redirect customer to Stripe Checkout.
        window.location.href = checkoutUrl;
      } catch (error) {
        console.error("Payment error:", error);

        notify(
          {
            success: false,
            message: error.message || "Could not start payment.",
          },
          router
        );

        setPayingId(null);
      }
    });
  }

  // Empty appointments.
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="No appointments yet"
        text="Book a service and it will show up here."
        action={
          <Link href="/services" className={buttonVariants()}>
            Browse services
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {appointments.map((a) => {
          const canCancel = a.status === "pending";

          const canPay =
            a.status === "confirmed" &&
            a.paymentStatus !== "paid";

          const paying = payingId === a._id;

          return (
            <Card key={a._id}>
              <CardContent className="space-y-4">
                {/* Service information */}
                <div className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {a.serviceImage && (
                      <Image
                        src={a.serviceImage}
                        alt={a.serviceName || "Service"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">
                      {a.serviceName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {getCategoryLabel(a.serviceCategory)}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-primary">
                      {formatPrice(a.servicePrice)}
                    </p>
                  </div>
                </div>

                {/* Appointment date and time */}
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="font-medium">
                      {formatDate(a.date)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Time</dt>
                    <dd className="font-medium">
                      {formatSlot(a.timeSlot)}
                    </dd>
                  </div>
                </dl>

                {/* Appointment and payment status */}
                <div className="flex flex-wrap gap-2">
                  <AppointmentStatusBadge status={a.status} />
                  <PaymentBadge status={a.paymentStatus} />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDetails(a)}
                  >
                    Details
                  </Button>

                  {canPay && (
                    <Button
                      size="sm"
                      disabled={isPending || !!payingId}
                      onClick={() => handlePay(a)}
                    >
                      {paying ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Redirecting...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 size-4" />
                          Pay Now
                        </>
                      )}
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => setCancelTarget(a)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Appointment details dialog */}
      <Dialog
        open={!!details}
        onOpenChange={(open) => !open && setDetails(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{details?.serviceName}</DialogTitle>

            <DialogDescription>
              Appointment details
            </DialogDescription>
          </DialogHeader>

          {details && (
            <DetailList
              items={[
                [
                  "Category",
                  getCategoryLabel(details.serviceCategory),
                ],
                ["Date", formatDate(details.date)],
                ["Time", formatSlot(details.timeSlot)],
                ["Duration", `${details.serviceDuration} min`],
                ["Price", formatPrice(details.servicePrice)],
                [
                  "Status",
                  <AppointmentStatusBadge
                    key="status"
                    status={details.status}
                  />,
                ],
                [
                  "Payment",
                  <PaymentBadge
                    key="payment"
                    status={details.paymentStatus}
                  />,
                ],
                ["Message", details.notes || "—"],
                [
                  "Requested on",
                  formatDateTime(details.createdAt),
                ],
              ]}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation dialog */}
      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) =>
          !open && !isPending && setCancelTarget(null)
        }
        title="Cancel this appointment?"
        description={`Your pending request for ${
          cancelTarget?.serviceName || "this service"
        } will be cancelled and the time slot released.`}
        confirmLabel="Yes, cancel it"
        cancelLabel="Keep it"
        destructive
        loading={isPending}
        onConfirm={handleCancel}
      />
    </>
  );
}
