"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

// Re-fetches the server data of the current page every few seconds, so changes
// (payment paid, appointment confirmed) show up without a manual reload.
// It pauses while the tab is hidden and refreshes as soon as the tab is opened again.
export default function LiveRefresh({ interval = 5000 }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") {
        startTransition(() => router.refresh());
      }
    };

    const timer = setInterval(refresh, interval);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router, interval]);

  return null;
}