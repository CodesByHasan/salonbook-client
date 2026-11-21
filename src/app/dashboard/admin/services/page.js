import Link from "next/link";
import { Plus } from "lucide-react";
import ServicesTable from "@/components/dashboard/ServicesTable";
import LoadError from "@/components/shared/LoadError";
import PageHeader from "@/components/shared/PageHeader";
import Pager from "@/components/shared/Pager";
import { buttonVariants } from "@/components/ui/button";
import { loadData } from "@/lib/api/fetcher";
import { getManageServices } from "@/lib/api/services";
import { toPage } from "@/lib/params";

export const metadata = { title: "Manage Services" };

export default async function ManageServicesPage({ searchParams }) {
  const page = toPage((await searchParams).page);
  const { data, error } = await loadData(() => getManageServices({ page, limit: 10 }));

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Services" description="Add, edit and remove the services customers can book.">
        <Link href="/dashboard/admin/services/add" className={buttonVariants()}>
          <Plus data-icon="inline-start" /> Add service
        </Link>
      </PageHeader>

      {error ? (
        <LoadError message={error} />
      ) : (
        <>
          <ServicesTable services={data.services} />
          <Pager basePath="/dashboard/admin/services" meta={data.meta} />
        </>
      )}
    </div>
  );
}