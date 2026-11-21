import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// SidebarTrigger is the hamburger: it opens the drawer on mobile and collapses the sidebar on desktop.
export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
      <span className="text-sm font-medium">Dashboard</span>
    </header>
  );
}