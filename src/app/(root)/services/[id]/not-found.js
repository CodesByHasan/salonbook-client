import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ServiceNotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <h1 className="text-2xl font-bold">Service not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">This link is invalid or the service no longer exists.</p>
      <Link href="/services" className={buttonVariants({ size: "lg", className: "mt-6" })}>
        Browse all services
      </Link>
    </section>
  );
}