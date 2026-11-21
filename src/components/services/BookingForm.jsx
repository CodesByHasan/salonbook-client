"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormField from "@/components/shared/FormField";
import { createAppointment } from "@/lib/actions/appointments";
import { TIME_SLOTS } from "@/lib/constants";
import { bookingSchema } from "@/lib/validators/appointment";
import { getFieldErrors } from "@/lib/validators/common";
import { cn, formatSlot } from "@/lib/utils";

const emptyValues = { date: "", timeSlot: "", message: "" };

// A slot is in the past if it has already started (Asia/Dhaka = UTC+6).
const isPastSlot = (date, slot) => Boolean(date && slot) && new Date(`${date}T${slot}:00+06:00`) <= new Date();

export default function BookingForm({ serviceId, minDate }) {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [booked, setBooked] = useState(false);
  const [isPending, startTransition] = useTransition();

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setBooked(false);
  };

  const changeDate = (date) => {
    // If the chosen slot is already past on the new date, clear it.
    setValues((current) => ({
      ...current,
      date,
      timeSlot: isPastSlot(date, current.timeSlot) ? "" : current.timeSlot,
    }));
    setErrors((current) => ({ ...current, date: undefined }));
    setBooked(false);
  };

  function handleSubmit(event) {
    event.preventDefault();

    const parsed = bookingSchema.safeParse({ serviceId, ...values });
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setErrors({});

    startTransition(async () => {
      const result = await createAppointment(parsed.data);

      if (result.success) {
        toast.success(result.message);
        setValues(emptyValues);
        setBooked(true);
      } else {
        setErrors(result.errors ?? {});
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {booked && (
        <div role="status" className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <p>
            Request sent! It stays <strong>pending</strong> until confirmed.{" "}
            {/* Block 6 adds the appointments page under this dashboard. */}
            <Link href="/dashboard/customer" className="font-medium underline underline-offset-4">
              Go to my dashboard
            </Link>
          </p>
        </div>
      )}

      <FormField id="date" label="Date" error={errors.date?.[0]}>
        <Input
          id="date"
          type="date"
          min={minDate}
          value={values.date}
          onChange={(event) => changeDate(event.target.value)}
          disabled={isPending}
          className="h-10"
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? "date-error" : undefined}
        />
      </FormField>

      <fieldset className="space-y-1.5" disabled={isPending}>
        <legend className="text-sm leading-none font-medium">Time slot</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => {
            const past = isPastSlot(values.date, slot);
            const selected = values.timeSlot === slot;

            return (
              <button
                key={slot}
                type="button"
                disabled={past}
                aria-pressed={selected}
                onClick={() => update("timeSlot", slot)}
                className={cn(
                  "h-9 rounded-lg border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  selected ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {formatSlot(slot)}
              </button>
            );
          })}
        </div>
        {errors.timeSlot?.[0] && <p role="alert" className="text-xs text-destructive">{errors.timeSlot[0]}</p>}
      </fieldset>

      <FormField id="message" label="Message (optional)" error={errors.message?.[0]} hint="Anything the stylist should know. Max 300 characters.">
        <Textarea
          id="message"
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          maxLength={300}
          rows={3}
          disabled={isPending}
          aria-invalid={!!errors.message}
        />
      </FormField>

      <Button type="submit" className="h-10 w-full" disabled={isPending}>
        {isPending ? "Sending request…" : "Request Appointment"}
      </Button>
    </form>
  );
}