import { z } from "zod";

// Only these three fields exist. role / blocked / email can never be sent.
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .pipe(z.union([z.literal(""), z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladesh phone number")])),
  image: z
    .string()
    .trim()
    .pipe(z.union([z.literal(""), z.url({ protocol: /^https?$/, error: "Enter a valid image URL (https://...)" })])),
});