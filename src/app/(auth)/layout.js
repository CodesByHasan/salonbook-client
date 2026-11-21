import Link from "next/link";
import { CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";

const highlights = [
  { icon: CalendarCheck, text: "Book your slot in seconds" },
  { icon: ShieldCheck, text: "Verified salon professionals" },
  { icon: Sparkles, text: "Premium beauty services" },
];

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-rose-600 to-rose-900 p-12 text-white lg:flex">
        <div aria-hidden className="absolute -top-32 -right-32 size-96 rounded-full bg-white/10 blur-3xl" />
        <Link href="/" className="relative text-2xl font-bold">
          Salon<span className="text-rose-200">Book</span>
        </Link>

        <div className="relative max-w-md">
          <h1 className="text-4xl leading-tight font-semibold">Look good. Feel great. Book instantly.</h1>
          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="grid size-9 place-items-center rounded-lg bg-white/15">
                  <Icon className="size-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">© {new Date().getFullYear()} SalonBook</p>
      </aside>

      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <Link href="/" className="mb-8 text-2xl font-bold lg:hidden">
          Salon<span className="text-primary">Book</span>
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}