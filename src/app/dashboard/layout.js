import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSession } from "@/lib/session";

// Every dashboard page requires a login. Role checks live in dashboard/admin and dashboard/customer layouts,
// and the API enforces roles again on every request.
export default async function DashboardLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/sign-in?redirect=/dashboard");

  // The shadcn sidebar remembers open/collapsed in this cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
    role: session.user.role ?? "user",
  };

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar user={user} />
        <SidebarInset className="min-w-0">
          <DashboardHeader />
          <div className="flex-1 p-4 sm:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}