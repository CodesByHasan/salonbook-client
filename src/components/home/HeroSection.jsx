import Image from "next/image";
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
      {/* Photo: public/images/salon-hero.jpg (use a photo at least 2400 px wide, under 400 KB). */}
      <Image
        src="/images/salon-hero.jpg"
        alt=""
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover object-right"
      />

      {/* Readability: covers the photo on phones, fades in from the left on wide screens,
          so the photo stays vivid on the right and the text stays clean on the left. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-background/85 lg:bg-transparent lg:bg-linear-to-r lg:from-background lg:from-35% lg:via-background/85 lg:via-55% lg:to-background/0"
      />

      {/* Soft edge into the next section. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur">
            <Sparkles className="size-3.5" /> Your beauty, our priority
          </span>

          <h1 className="mt-6 text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Book your perfect <span className="text-primary">salon day</span> in a few clicks
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/70">
            Browse hair, skin, nails, makeup and spa services, pick a time that suits you, and walk in without the wait.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/services"
              className={buttonVariants({ size: "lg", className: "h-12 px-7 text-base shadow-lg shadow-primary/25" })}
            >
              Explore Salon Services <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              href="/sign-up"
              className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 bg-background/80 px-7 text-base backdrop-blur" })}
            >
              Create Free Account
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-3 text-sm">
            {perks.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 rounded-full border bg-background/70 px-3.5 py-1.5 text-foreground/80 backdrop-blur"
              >
                <Icon className="size-4 text-primary" /> {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}