"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVICE_CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { buildQuery } from "@/lib/utils";

const selectClass =
  "h-10 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

// The URL is the single source of truth: /services?search=&category=&sort=
export default function ServiceFilters({ initial }) {
  const { search: urlSearch, category, sort } = initial;
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(urlSearch);
  const [, startTransition] = useTransition();

  // Page is dropped, so every filter change starts at page 1.
  const go = useCallback(
    (next) => {
      const query = buildQuery(next);
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [router, pathname],
  );

  // Debounced search: wait 400 ms after the user stops typing.
  useEffect(() => {
    const value = search.trim();
    if (value === urlSearch) return;

    const timer = setTimeout(() => go({ search: value, category, sort }), 400);
    return () => clearTimeout(timer);
  }, [search, urlSearch, category, sort, go]);

  const hasFilters = urlSearch || category || sort;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_200px_200px_auto]">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search services..."
          aria-label="Search services"
          className="h-10 pl-9"
        />
      </div>

      <select
        value={category}
        onChange={(event) => go({ search: search.trim(), category: event.target.value, sort })}
        aria-label="Filter by category"
        className={selectClass}
      >
        <option value="">All categories</option>
        {SERVICE_CATEGORIES.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(event) => go({ search: search.trim(), category, sort: event.target.value })}
        aria-label="Sort by price"
        className={selectClass}
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {hasFilters && (
        <Button
          variant="outline"
          className="h-10"
          onClick={() => {
            setSearch("");
            go({});
          }}
        >
          <X /> Clear
        </Button>
      )}
    </div>
  );
}