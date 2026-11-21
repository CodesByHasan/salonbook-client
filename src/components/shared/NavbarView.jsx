"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export default function NavbarView({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = () => setMenuOpen(false);
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  async function handleLogout() {
    closeMenu();
    try {
      const { error } = await signOut();
      if (error) throw new Error(error.message);

      toast.success("You have been logged out.");
      router.push("/");
      router.refresh(); // re-reads the session in the server Navbar
    } catch (error) {
      toast.error(error.message || "Could not log out. Please try again.");
    }
  }

  const linkClass = (href) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
      isActive(href) ? "text-primary" : "text-foreground/70",
    );

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" onClick={closeMenu} className="text-2xl font-bold tracking-tight">
          Salon<span className="text-primary">Book</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)} aria-current={isActive(href) ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="h-10 gap-2 rounded-full px-2" />}>
                <Avatar size="sm">
                  <AvatarImage src={user.image || undefined} alt="" />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">{user.name}</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col gap-0.5 py-1.5">
                    <span className="truncate text-sm font-medium text-foreground">{user.name}</span>
                    <span className="truncate text-xs font-normal">{user.email}</span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={dashboardPath(user.role)} />}>
                  <LayoutDashboard />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/sign-in" className={buttonVariants({ variant: "ghost", size: "lg" })}>
                Sign In
              </Link>
              <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
                Sign Up
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={closeMenu} className={linkClass(href)}>
                {label}
              </Link>
            ))}

            {!user && (
              <div className="mt-3 flex flex-col gap-2 border-t pt-4">
                <Link href="/sign-in" onClick={closeMenu} className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Sign In
                </Link>
                <Link href="/sign-up" onClick={closeMenu} className={buttonVariants({ size: "lg" })}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}