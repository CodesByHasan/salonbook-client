import Link from "next/link";
import { CalendarCheck, CalendarClock, CalendarX2, ListChecks } from "lucide-react";
import LiveRefresh from "@/components/shared/LiveRefresh";
import LoadError from "@/components/shared/LoadError";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { buttonVariants } from "@/components/ui/button";
import { getMyAppointments } from "@/lib/api/appointments";
import { loadData } from "@/lib/api/fetcher";

export const metadata = { title: "My Dashboard" };

export default async function CustomerOverviewPage() {
  const { data: appointments, error } = await loadData(getMyAppointments);

  const count = (status) => appointments.filter((a) => a.status === status).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="A summary of your appointments.">
        <Link href="/services" className={buttonVariants()}>Book a service</Link>
      </PageHeader>

      {error ? (
        <LoadError message={error} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total" value={appointments.length} icon={ListChecks} />
          <StatCard label="Pending" value={count("pending")} icon={CalendarClock} />
          <StatCard label="Confirmed" value={count("confirmed")} icon={CalendarCheck} />
          <StatCard label="Cancelled" value={count("cancelled")} icon={CalendarX2} />
        </div>
      )}

      <LiveRefresh />
    </div>
  );
}