import { redirect } from "next/navigation";
import { dashboardPath } from "@/lib/constants";
import { getSession } from "@/lib/session";

// Only admins. Everyone else goes to their own dashboard.
export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (session?.user.role !== "admin") redirect(dashboardPath(session?.user.role));

  return children;
}