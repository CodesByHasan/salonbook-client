import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// Every dashboard page requires a login (Block 6 adds the sidebar here).
export default async function DashboardLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/sign-in?redirect=/dashboard");

  return children;
}