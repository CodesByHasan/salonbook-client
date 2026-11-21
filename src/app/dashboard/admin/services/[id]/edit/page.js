import { notFound } from "next/navigation";
import ServiceForm from "@/components/dashboard/ServiceForm";
import PageHeader from "@/components/shared/PageHeader";
import { getServiceById } from "@/lib/api/services";

export const metadata = { title: "Edit Service" };

export default async function EditServicePage({ params }) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit service" description={service.name} />
      <ServiceForm service={service} />
    </div>
  );
}