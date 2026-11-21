import { z } from "zod";
import { SERVICE_CATEGORIES } from "@/lib/constants";

export const serviceFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000, "Description is too long"),
  category: z.enum(
    SERVICE_CATEGORIES.map((category) => category.value),
    { error: "Choose a category" },
  ),
  price: z.coerce.number({ error: "Enter a valid price" }).positive("Price must be greater than 0"),
  duration: z.coerce
    .number({ error: "Enter the duration in minutes" })
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0")
    .max(600, "Duration cannot exceed 600 minutes"),
  image: z.url({ protocol: /^https?$/, error: "Upload an image or paste an image URL (https://...)" }),
  status: z.enum(["active", "inactive"]),
});