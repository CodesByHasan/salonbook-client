import Link from "next/link";
import { cn } from "@/lib/utils";

// Scissors on a rose badge. Used in the navbar, footer, sidebar and auth pages.
function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-rose-500 to-rose-700 text-white shadow-md shadow-rose-600/30 ring-1 ring-white/20 inset-shadow-xs inset-shadow-white/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 motion-reduce:transition-none"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[64%] -rotate-45"
      >
        <circle cx="6" cy="6.5" r="3" />
        <circle cx="6" cy="17.5" r="3" />
        <path d="M8.2 8.7 21 20M8.2 15.3 21 4" />
      </svg>
    </span>
  );
}

// className = text colour/size of the name, accentClassName = colour of "Book".
export default function Logo({ className, accentClassName = "text-primary", ...props }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2 text-2xl font-bold tracking-tight", className)}
      {...props}
    >
      <LogoMark />
      <span>
        Salon<span className={accentClassName}>Book</span>
      </span>
    </Link>
  );
}