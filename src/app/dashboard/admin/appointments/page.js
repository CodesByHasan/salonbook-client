import Link from "next/link";
import AdminAppointmentsTable from "@/components/dashboard/AdminAppointmentsTable";
import LiveRefresh from "@/components/shared/LiveRefresh";
import LoadError from "@/components/shared/LoadError";
import PageHeader from "@/components/shared/PageHeader";
import Pager from "@/components/shared/Pager";
import { getAdminAppointments } from "@/lib/api/appointments";
import { loadData } from "@/lib/api/fetcher";
import { first, toPage } from "@/lib/params";
import { cn } from "@/lib/utils";

export const metadata = { title: "Manage Appointments" };

const FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function ManageAppointmentsPage({ searchParams }) {
  const sp = await searchParams;
  const status = FILTERS.some((filter) => filter.value && filter.value === first(sp.status)) ? first(sp.status) : "";
  const page = toPage(sp.page);

  const { data, error } = await loadData(() => getAdminAppointments({ status, page, limit: 10 }));

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Appointments" description="Confirm or cancel customer requests." />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <Link
            key={label}
            href={value ? `/dashboard/admin/appointments?status=${value}` : "/dashboard/admin/appointments"}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              status === value ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {error ? (
        <LoadError message={error} />
      ) : (
        <>
          <AdminAppointmentsTable appointments={data.appointments} />
          <Pager basePath="/dashboard/admin/appointments" params={{ status }} meta={data.meta} />
        </>
      )}

      <LiveRefresh />
    </div>
  );
}