import Link from "next/link";
import { Crown, Flower2, Hand, Palette, Scissors, Sparkles } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/constants";

const icons = { hair: Scissors, skin: Sparkles, nails: Hand, makeup: Palette, spa: Flower2, bridal: Crown };

export default function CategorySection() {
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
          <p className="mt-2 text-muted-foreground">Find exactly what you are looking for.</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SERVICE_CATEGORIES.map(({ value, label }) => {
            const Icon = icons[value] ?? Sparkles;
            return (
              <Link
                key={value}
                href={`/services?category=${value}`}
                className="group flex flex-col items-center gap-3 rounded-xl border bg-background p-6 text-center transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <span className="grid size-12 place-items-center rounded-full bg-rose-50 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <span className="text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}