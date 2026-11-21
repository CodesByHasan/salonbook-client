"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarX2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import DetailList from "@/components/shared/DetailList";
import EmptyState from "@/components/shared/EmptyState";
import { AppointmentStatusBadge, PaymentBadge } from "@/components/shared/StatusBadge";
import { adminCancelAppointment, confirmAppointment } from "@/lib/actions/appointments";
import { getCategoryLabel } from "@/lib/constants";
import { notify } from "@/lib/notify";
import { formatDate, formatDateTime, formatPrice, formatSlot } from "@/lib/utils";

export default function AdminAppointmentsTable({ appointments }) {
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [action, setAction] = useState(null); // { kind: "confirm" | "cancel", appointment }
  const [isPending, startTransition] = useTransition();

  function runAction() {
    const { kind, appointment } = action;
    startTransition(async () => {
      const result =
        kind === "confirm" ? await confirmAppointment(appointment._id) : await adminCancelAppointment(appointment._id);
      notify(result, router);
      setAction(null);
    });
  }

  if (appointments.length === 0) {
    return <EmptyState icon={CalendarX2} title="No appointments found" text="Appointments will appear here when customers book." />;
  }

  const isConfirm = action?.kind === "confirm";

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & time</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((a) => (
              <TableRow key={a._id}>
                <TableCell className="pl-4">
                  <p className="font-medium">{a.userName}</p>
                  <p className="text-xs text-muted-foreground">{a.userEmail}</p>
                </TableCell>
                <TableCell>{a.serviceName}</TableCell>
                <TableCell>{formatDate(a.date)}, {formatSlot(a.timeSlot)}</TableCell>
                <TableCell className="max-w-40 truncate text-muted-foreground">{a.notes || "—"}</TableCell>
                <TableCell>{formatPrice(a.servicePrice)}</TableCell>
                <TableCell><AppointmentStatusBadge status={a.status} /></TableCell>
                <TableCell><PaymentBadge status={a.paymentStatus} /></TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setDetails(a)}>Details</Button>
                    {a.status === "pending" && (
                      <Button size="sm" onClick={() => setAction({ kind: "confirm", appointment: a })}>Confirm</Button>
                    )}
                    {["pending", "confirmed"].includes(a.status) && a.paymentStatus !== "paid" && (
                      <Button variant="destructive" size="sm" onClick={() => setAction({ kind: "cancel", appointment: a })}>Cancel</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                ["Customer", details.userName],
                ["Email", details.userEmail],
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
        open={!!action}
        onOpenChange={(open) => !open && setAction(null)}
        title={isConfirm ? "Confirm this appointment?" : "Cancel this appointment?"}
        description={
          isConfirm
            ? `${action?.appointment.userName} will be able to pay for ${action?.appointment.serviceName}.`
            : "The appointment will be cancelled and the time slot released."
        }
        confirmLabel={isConfirm ? "Confirm" : "Yes, cancel it"}
        destructive={!isConfirm}
        loading={isPending}
        onConfirm={runAction}
      />
    </>
  );
}