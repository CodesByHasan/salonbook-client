import { redirect } from "next/navigation";
import PaymentStatus from "@/components/payment/PaymentStatus";
import { getSession } from "@/lib/session";
import { first } from "@/lib/params";

export const metadata = { title: "Payment" };

// Stripe sends the customer here: /payment/success?session_id=cs_test_...
export default async function PaymentSuccessPage({ searchParams }) {
  const sessionId = first((await searchParams).session_id);

  if (!sessionId) redirect("/dashboard/customer/appointments");

  const session = await getSession();
  if (!session) {
    redirect(`/sign-in?redirect=${encodeURIComponent(`/payment/success?session_id=${sessionId}`)}`);
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4 py-16">
      <PaymentStatus sessionId={sessionId} />
    </div>
  );
}