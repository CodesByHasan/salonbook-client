"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </section>
  );
}