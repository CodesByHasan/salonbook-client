"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormField from "@/components/shared/FormField";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";
import { signUp } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/validators/auth";
import { getFieldErrors } from "@/lib/validators/common";

export default function SignUpForm({ redirectTo }) {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const parsed = signUpSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setIsLoading(true);

    const { name, email, password, image } = parsed.data;

    try {
      // Role is never sent. The server always creates "user".
      const { error } = await signUp.email({ name, email, password, image: image || undefined });
      if (error) throw new Error(error.message || "Could not create your account.");

      toast.success("Account created! Welcome to SalonBook.");
      router.replace(redirectTo ?? "/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  const signInHref = redirectTo ? `/sign-in?redirect=${encodeURIComponent(redirectTo)}` : "/sign-in";
  const invalid = (field) => ({
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Join SalonBook and book your first appointment.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField id="name" label="Full name" error={errors.name?.[0]}>
          <Input id="name" name="name" autoComplete="name" placeholder="Your name" className="h-10" disabled={isLoading} {...invalid("name")} />
        </FormField>

        <FormField id="email" label="Email" error={errors.email?.[0]}>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="h-10" disabled={isLoading} {...invalid("email")} />
        </FormField>

        <FormField id="image" label="Profile image URL (optional)" error={errors.image?.[0]}>
          <Input id="image" name="image" type="url" placeholder="https://..." className="h-10" disabled={isLoading} {...invalid("image")} />
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.[0]} hint="At least 8 characters.">
          <PasswordInput id="password" name="password" autoComplete="new-password" placeholder="••••••••" disabled={isLoading} {...invalid("password")} />
        </FormField>

        <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.[0]}>
          <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" placeholder="••••••••" disabled={isLoading} {...invalid("confirmPassword")} />
        </FormField>

        <Button type="submit" className="h-10 w-full" disabled={isLoading}>
          {isLoading ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton redirectTo={redirectTo} disabled={isLoading} />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={signInHref} className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}