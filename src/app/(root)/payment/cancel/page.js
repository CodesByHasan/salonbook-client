import Link from "next/link";
import { OctagonX } from "lucide-react";
import ToastOnMount from "@/components/shared/ToastOnMount";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Payment cancelled" };

// Stripe sends the customer here if they leave the payment page without paying.
export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <OctagonX className="size-16 text-amber-600" />
      <h1 className="mt-4 text-2xl font-bold">Payment cancelled</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You left the payment page before paying, so no money was taken. Your appointment is still confirmed
        and you can pay at any time.
      </p>
      <Link href="/dashboard/customer/appointments" className={buttonVariants({ size: "lg", className: "mt-6" })}>
        Back to my appointments
      </Link>
      <ToastOnMount type="warning" message="Payment cancelled. No money was taken." />
    </div>
  );
}