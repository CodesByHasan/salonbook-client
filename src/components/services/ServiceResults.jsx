import Link from "next/link";
import { SearchX } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { buttonVariants } from "@/components/ui/button";
import { loadData } from "@/lib/api/fetcher";
import { getServices } from "@/lib/api/services";
import { PAGE_SIZE } from "@/lib/constants";
import { buildQuery, cn } from "@/lib/utils";

const pageHref = (filters, page) => {
  const query = buildQuery({ ...filters, page: page > 1 ? page : "" });
  return query ? `/services?${query}` : "/services";
};

export default async function ServiceResults({ filters }) {
  const { data, error } = await loadData(() => getServices({ ...filters, limit: PAGE_SIZE }));

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  const { services, meta } = data;

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <h2 className="text-lg font-semibold">No services found</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try a different search or category, or clear your filters.
        </p>
        <Link href="/services" className={buttonVariants({ variant: "outline" })}>
          Clear filters
        </Link>
      </div>
    );
  }

  const page = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Showing {services.length} of {meta?.total ?? services.length} services
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-3">
          <Link
            href={pageHref(filters, page - 1)}
            aria-disabled={page <= 1}
            className={cn(buttonVariants({ variant: "outline" }), page <= 1 && "pointer-events-none opacity-50")}
          >
            Previous
          </Link>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Link
            href={pageHref(filters, page + 1)}
            aria-disabled={page >= totalPages}
            className={cn(buttonVariants({ variant: "outline" }), page >= totalPages && "pointer-events-none opacity-50")}
          >
            Next
          </Link>
        </nav>
      )}
    </>
  );
}