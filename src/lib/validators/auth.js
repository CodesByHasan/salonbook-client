import { z } from "zod";

const email = z.string().trim().pipe(z.email("Enter a valid email address"));

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name is too long"),
    email,

    // Optional profile image URL ("" is allowed).
    image: z
      .string()
      .trim()
      .pipe(
        z.union([
          z.literal(""),
          z.url({
            protocol: /^https?$/,
            error: "Enter a valid image URL (https://...)",
          }),
        ])
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(/[A-Z]/, "Password must include one uppercase letter")
      .regex(/[a-z]/, "Password must include one lowercase letter"),

    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });
