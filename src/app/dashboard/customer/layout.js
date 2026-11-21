import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// Admins have their own dashboard.
export default async function CustomerLayout({ children }) {
  const session = await getSession();
  if (session?.user.role === "admin") redirect("/dashboard/admin");

  return children;
}