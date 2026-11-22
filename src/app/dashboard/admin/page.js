import { CalendarCheck, CalendarClock, CalendarRange, CreditCard, Scissors, Users } from "lucide-react";
import LiveRefresh from "@/components/shared/LiveRefresh";
import LoadError from "@/components/shared/LoadError";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { loadData } from "@/lib/api/fetcher";
import { getAdminStats } from "@/lib/api/stats";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminOverviewPage() {
  const { data: stats, error } = await loadData(getAdminStats);

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="How the salon is doing." />

      {error ? (
        <LoadError message={error} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Customers" value={stats.customers} icon={Users} />
          <StatCard label="Active services" value={stats.activeServices} icon={Scissors} />
          <StatCard label="Total appointments" value={stats.totalAppointments} icon={CalendarRange} />
          <StatCard label="Pending appointments" value={stats.pendingAppointments} icon={CalendarClock} />
          <StatCard label="Confirmed appointments" value={stats.confirmedAppointments} icon={CalendarCheck} />
          <StatCard label="Successful payments" value={stats.successfulPayments} icon={CreditCard} />
        </div>
      )}

      <LiveRefresh />
    </div>
  );
}