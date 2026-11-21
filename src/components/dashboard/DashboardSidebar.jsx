
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  Scissors,
  Users,
  Wallet,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItemsByRole = {
  customer: [
    {
      name: "Overview",
      url: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      name: "My Appointments",
      url: "/dashboard/customer/appointments",
      icon: CalendarDays,
    },
    {
      name: "My Profile",
      url: "/dashboard/customer/profile",
      icon: UserRound,
    },
  ],

  admin: [
    {
      name: "Overview",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Services",
      url: "/dashboard/admin/services",
      icon: Scissors,
    },
    {
      name: "Manage Appointments",
      url: "/dashboard/admin/appointments",
      icon: CalendarDays,
    },
    {
      name: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      name: "Transactions",
      url: "/dashboard/admin/transactions",
      icon: Wallet,
    },
    {
      name: "My Profile",
      url: "/dashboard/admin/profile",
      icon: UserRound,
    },
  ],
};

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();

  const role = user?.role === "admin" ? "admin" : "customer";
  const menuItems = menuItemsByRole[role];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Scissors className="size-6 text-primary" />
          <span>SalonBook</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "admin" ? "Administration" : "Customer Menu"}
          </SidebarGroupLabel>

          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    tooltip={item.name}
                  >
                    <Icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <p className="truncate text-sm font-medium">
          {user?.name || "SalonBook User"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {user?.email || ""}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

