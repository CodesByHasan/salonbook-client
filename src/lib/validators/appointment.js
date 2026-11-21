import { z } from "zod";
import { TIME_SLOTS } from "@/lib/constants";

export const bookingSchema = z
  .object({
    serviceId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid service"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
    timeSlot: z.enum(TIME_SLOTS, { error: "Choose a time slot" }),
    message: z.string().trim().max(300, "Message must be 300 characters or fewer").optional(),
  })
  .superRefine((data, ctx) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !TIME_SLOTS.includes(data.timeSlot)) return;

    // Asia/Dhaka is UTC+6. The server checks this again.
    if (new Date(`${data.date}T${data.timeSlot}:00+06:00`) <= new Date()) {
      ctx.addIssue({ code: "custom", path: ["timeSlot"], message: "Choose a future date and time" });
    }
  });