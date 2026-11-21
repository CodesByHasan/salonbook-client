"use client";

import { useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    toast.error("Something went wrong while loading this page.", { id: "dashboard-error" });
  }, [error]);

  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">We could not load this page. Please try again.</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>Dashboard home</Link>
      </div>
    </section>
  );
}