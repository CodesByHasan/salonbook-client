import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";
import { getServices } from "@/lib/api/services";

// The first 6 active services from the database.
async function FeaturedList() {
  let services = [];

  try {
    ({ services } = await getServices({ limit: 6 }));
  } catch {
    return <p className="py-10 text-center text-sm text-muted-foreground">Services are temporarily unavailable. Please try again soon.</p>;
  }

  if (services.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Services will appear here soon.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}

export default function FeaturedServices() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Services</h2>
          <p className="mt-2 text-muted-foreground">Our most loved treatments, ready to book.</p>
        </div>
        <Link href="/services" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex">
          View all <ArrowRight className="size-4" />
        </Link>
      </div>

      <Suspense fallback={<ServiceGridSkeleton count={6} />}>
        <FeaturedList />
      </Suspense>
    </section>
  );
}