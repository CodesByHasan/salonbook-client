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
import { signIn } from "@/lib/auth-client";
import { signInSchema } from "@/lib/validators/auth";
import { getFieldErrors } from "@/lib/validators/common";

export default function SignInForm({ redirectTo }) {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const parsed = signInSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { data, error } = await signIn.email(parsed.data);
      if (error) throw new Error(error.message || "Invalid email or password.");

      toast.success(`Welcome back, ${data.user.name}!`);

      // /dashboard sends each role to its own dashboard (admin / customer).
      router.replace(redirectTo ?? "/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  const signUpHref = redirectTo ? `/sign-up?redirect=${encodeURIComponent(redirectTo)}` : "/sign-up";
  const invalid = (field) => ({
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to book and manage your appointments.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField id="email" label="Email" error={errors.email?.[0]}>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="h-10" disabled={isLoading} {...invalid("email")} />
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.[0]}>
          <PasswordInput id="password" name="password" autoComplete="current-password" placeholder="••••••••" disabled={isLoading} {...invalid("password")} />
        </FormField>

        <Button type="submit" className="h-10 w-full" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton redirectTo={redirectTo} disabled={isLoading} />

      <p className="text-center text-sm text-muted-foreground">
        New to SalonBook?{" "}
        <Link href={signUpHref} className="font-medium text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}