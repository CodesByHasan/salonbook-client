import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { buildQuery, cn } from "@/lib/utils";

// Previous / Next links that keep the other search params.
export default function Pager({ basePath, params = {}, meta }) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages } = meta;
  const href = (target) => {
    const query = buildQuery({ ...params, page: target > 1 ? target : "" });
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3">
      <Link
        href={href(page - 1)}
        aria-disabled={page <= 1}
        className={cn(buttonVariants({ variant: "outline" }), page <= 1 && "pointer-events-none opacity-50")}
      >
        Previous
      </Link>
      <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
      <Link
        href={href(page + 1)}
        aria-disabled={page >= totalPages}
        className={cn(buttonVariants({ variant: "outline" }), page >= totalPages && "pointer-events-none opacity-50")}
      >
        Next
      </Link>
    </nav>
  );
}