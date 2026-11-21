import ServiceForm from "@/components/dashboard/ServiceForm";
import PageHeader from "@/components/shared/PageHeader";

export const metadata = { title: "Add Service" };

export default function AddServicePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add service" description="Create a new service for customers to book." />
      <ServiceForm />
    </div>
  );
}