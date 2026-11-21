"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarCheck, CreditCard, Home, LayoutDashboard, LogOut, Scissors, UserRound, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";

// Role-based navigation. Better Auth's default role "user" is the customer.
const NAV = {
  admin: [
    { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Manage Services", href: "/dashboard/admin/services", icon: Scissors },
    { title: "Manage Appointments", href: "/dashboard/admin/appointments", icon: CalendarCheck },
    { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { title: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
    { title: "My Profile", href: "/dashboard/admin/profile", icon: UserRound },
  ],
  user: [
    { title: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { title: "My Appointments", href: "/dashboard/customer/appointments", icon: CalendarCheck },
    { title: "My Profile", href: "/dashboard/customer/profile", icon: UserRound },
  ],
};

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const items = user.role === "admin" ? NAV.admin : NAV.user;
  const overviewHref = items[0].href;
  const isActive = (href) => (href === overviewHref ? pathname === href : pathname.startsWith(href));

  async function handleLogout() {
    try {
      const { error } = await signOut();
      if (error) throw new Error(error.message);
      toast.success("You have been logged out.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Could not log out. Please try again.");
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Salon<span className="text-primary">Book</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{user.role === "admin" ? "Admin" : "My account"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ title, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={isActive(href)}
                    tooltip={title}
                    render={<Link href={href} onClick={() => setOpenMobile(false)} />}
                  >
                    <Icon />
                    <span>{title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 border-t p-3">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.image || undefined} alt="" />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" onClick={() => setOpenMobile(false)} />}>
              <Home />
              <span>Back to site</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}