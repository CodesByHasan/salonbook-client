import { redirect } from "next/navigation";
import { dashboardPath } from "@/lib/constants";
import { getSession } from "@/lib/session";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (session?.user.role !== "admin") redirect(dashboardPath(session?.user.role));

  return <h1 className="p-8 text-2xl font-semibold">Admin dashboard</h1>;
}