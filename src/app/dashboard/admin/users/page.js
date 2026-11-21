import UsersTable from "@/components/dashboard/UsersTable";
import LoadError from "@/components/shared/LoadError";
import PageHeader from "@/components/shared/PageHeader";
import Pager from "@/components/shared/Pager";
import { loadData } from "@/lib/api/fetcher";
import { getUsers } from "@/lib/api/users";
import { toPage } from "@/lib/params";

export const metadata = { title: "Manage Users" };

export default async function ManageUsersPage({ searchParams }) {
  const page = toPage((await searchParams).page);
  const { data, error } = await loadData(() => getUsers({ page, limit: 10 }));

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Users" description="View users and block or unblock customers." />

      {error ? (
        <LoadError message={error} />
      ) : (
        <>
          <UsersTable users={data.users} />
          <Pager basePath="/dashboard/admin/users" meta={data.meta} />
        </>
      )}
    </div>
  );
}