import { redirect } from "next/navigation";
import { dashboardPath } from "@/lib/constants";
import { getSession } from "@/lib/session";

// admin -> /dashboard/admin, everyone else -> /dashboard/customer.
export default async function DashboardIndexPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in?redirect=/dashboard");

  redirect(dashboardPath(session.user.role));
}