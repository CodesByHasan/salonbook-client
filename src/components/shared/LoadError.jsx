"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// Shown when a page could not load its data (API down, 403 blocked, ...).
export default function LoadError({ message }) {
  const router = useRouter();

  useEffect(() => {
    toast.error(message, { id: "load-error" });
  }, [message]);

  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-12 text-center">
      <TriangleAlert className="size-9 text-destructive" />
      <p className="max-w-md text-sm">{message}</p>
      <Button variant="outline" onClick={() => router.refresh()}>Try again</Button>
    </div>
  );
}