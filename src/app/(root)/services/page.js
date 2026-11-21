import { Suspense } from "react";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";
import ServiceResults from "@/components/services/ServiceResults";

export const metadata = { title: "Browse Services" };

const first = (value) => (Array.isArray(value) ? value[0] : value) ?? "";

// Clean values from the URL. Bad values fall back to "no filter".
function parseFilters(searchParams) {
  const sort = first(searchParams.sort);
  const page = Math.max(1, parseInt(first(searchParams.page), 10) || 1);

  return {
    search: first(searchParams.search).trim().slice(0, 100),
    category: first(searchParams.category).trim().toLowerCase().slice(0, 50),
    sort: sort === "asc" || sort === "desc" ? sort : "",
    page: page > 1 ? String(page) : "",
  };
}

export default async function ServicesPage({ searchParams }) {
  const filters = parseFilters(await searchParams);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Services</h1>
        <p className="mt-2 text-muted-foreground">Search, filter and find the right treatment for you.</p>
      </div>

      <ServiceFilters initial={filters} />

      {/* key = filters, so the skeleton shows again whenever the filters change */}
      <Suspense key={JSON.stringify(filters)} fallback={<ServiceGridSkeleton count={6} />}>
        <div className="space-y-6">
          <ServiceResults filters={filters} />
        </div>
      </Suspense>
    </div>
  );
}