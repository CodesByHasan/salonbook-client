"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarX2, CreditCard } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import DetailList from "@/components/shared/DetailList";
import EmptyState from "@/components/shared/EmptyState";
import { AppointmentStatusBadge, PaymentBadge } from "@/components/shared/StatusBadge";
import { cancelMyAppointment } from "@/lib/actions/appointments";
import { startCheckout } from "@/lib/actions/payments";
import { getCategoryLabel } from "@/lib/constants";
import { notify } from "@/lib/notify";
import { formatDate, formatDateTime, formatPrice, formatSlot } from "@/lib/utils";

export default function AppointmentCards({ appointments }) {
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    const target = cancelTarget;
    startTransition(async () => {
      notify(await cancelMyAppointment(target._id), router);
      setCancelTarget(null);
    });
  }

  function handlePay(appointment) {
    setPayingId(appointment._id);
    startTransition(async () => {
      const result = await startCheckout(appointment._id);

      if (result.success && result.data?.url) {
        window.location.assign(result.data.url); // keep the button disabled until the page changes
        return;
      }

      notify(result, router);
      setPayingId(null);
    });
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="No appointments yet"
        text="Book a service and it will show up here."
        action={<Link href="/services" className={buttonVariants()}>Browse services</Link>}
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {appointments.map((a) => {
          const canCancel = a.status === "pending";
          const canPay = a.status === "confirmed" && a.paymentStatus !== "paid";
          const paying = payingId === a._id;

          return (
            <Card key={a._id}>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {a.serviceImage && <Image src={a.serviceImage} alt="" fill unoptimized className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{a.serviceName}</h3>
                    <p className="text-sm text-muted-foreground">{getCategoryLabel(a.serviceCategory)}</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{formatPrice(a.servicePrice)}</p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div><dt className="text-muted-foreground">Date</dt><dd className="font-medium">{formatDate(a.date)}</dd></div>
                  <div><dt className="text-muted-foreground">Time</dt><dd className="font-medium">{formatSlot(a.timeSlot)}</dd></div>
                </dl>

                <div className="flex flex-wrap gap-2">
                  <AppointmentStatusBadge status={a.status} />
                  <PaymentBadge status={a.paymentStatus} />
                </div>

                <div className="flex flex-wrap gap-2 border-t pt-3">
                  <Button variant="outline" size="sm" onClick={() => setDetails(a)}>Details</Button>
                  {canPay && (
                    <Button size="sm" disabled={isPending} onClick={() => handlePay(a)}>
                      <CreditCard data-icon="inline-start" />
                      {paying ? "Redirecting…" : "Pay Now"}
                    </Button>
                  )}
                  {canCancel && (
                    <Button variant="destructive" size="sm" disabled={isPending} onClick={() => setCancelTarget(a)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!details} onOpenChange={(open) => !open && setDetails(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{details?.serviceName}</DialogTitle>
            <DialogDescription>Appointment details</DialogDescription>
          </DialogHeader>
          {details && (
            <DetailList
              items={[
                ["Category", getCategoryLabel(details.serviceCategory)],
                ["Date", formatDate(details.date)],
                ["Time", formatSlot(details.timeSlot)],
                ["Duration", `${details.serviceDuration} min`],
                ["Price", formatPrice(details.servicePrice)],
                ["Status", <AppointmentStatusBadge key="s" status={details.status} />],
                ["Payment", <PaymentBadge key="p" status={details.paymentStatus} />],
                ["Message", details.notes || "—"],
                ["Requested on", formatDateTime(details.createdAt)],
              ]}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Cancel this appointment?"
        description={`Your pending request for ${cancelTarget?.serviceName ?? "this service"} will be cancelled and the time slot released.`}
        confirmLabel="Yes, cancel it"
        cancelLabel="Keep it"
        destructive
        loading={isPending}
        onConfirm={handleCancel}
      />
    </>
  );
}