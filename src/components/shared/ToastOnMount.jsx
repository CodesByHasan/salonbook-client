"use client";

import { useEffect } from "react";
import { toast } from "sonner";

// Fires one toast when a (server) page opens, e.g. "Payment cancelled".
export default function ToastOnMount({ type = "info", message }) {
  useEffect(() => {
    toast[type](message, { id: "page-notice" });
  }, [type, message]);

  return null;
}