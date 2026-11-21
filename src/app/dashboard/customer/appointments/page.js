import AppointmentCards from "@/components/dashboard/AppointmentCards";
import LoadError from "@/components/shared/LoadError";
import PageHeader from "@/components/shared/PageHeader";
import { getMyAppointments } from "@/lib/api/appointments";
import { loadData } from "@/lib/api/fetcher";

export const metadata = { title: "My Appointments" };

export default async function MyAppointmentsPage() {
  const { data, error } = await loadData(getMyAppointments);

  return (
    <div className="space-y-6">
      <PageHeader title="My Appointments" description="Track your bookings, cancel pending ones and pay for confirmed ones." />
      {error ? <LoadError message={error} /> : <AppointmentCards appointments={data} />}
    </div>
  );
}