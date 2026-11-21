import Link from "next/link";
import { ArrowRight, CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const perks = [
  { icon: CalendarCheck, text: "Instant online booking" },
  { icon: ShieldCheck, text: "Verified professionals" },
  { icon: Sparkles, text: "Premium products" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-rose-50 via-white to-amber-50">
      <div aria-hidden className="absolute -top-24 -right-24 size-96 rounded-full bg-rose-200/50 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -left-24 size-96 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> Your beauty, our priority
          </span>

          <h1 className="mt-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Book your perfect <span className="text-primary">salon day</span> in a few clicks
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Browse hair, skin, nails, makeup and spa services, pick a time that suits you, and walk in without the wait.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/services" className={buttonVariants({ size: "lg", className: "h-11 px-6 text-base" })}>
              Browse Services <ArrowRight data-icon="inline-end" />
            </Link>
            <Link href="/sign-up" className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-6 text-base" })}>
              Create Free Account
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="size-4 text-primary" /> {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}