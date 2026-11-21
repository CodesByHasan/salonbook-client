import { BadgeCheck, CalendarCheck, Clock, ShieldCheck } from "lucide-react";

const reasons = [
  { icon: CalendarCheck, title: "Easy booking", text: "Pick a date and a time slot online. No phone calls needed." },
  { icon: BadgeCheck, title: "Expert stylists", text: "Every service is delivered by trained, verified professionals." },
  { icon: Clock, title: "Save your time", text: "Reserved slots mean no waiting around when you arrive." },
  { icon: ShieldCheck, title: "Safe and hygienic", text: "Clean tools and quality products, every single visit." },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Why Choose SalonBook</h2>
        <p className="mt-2 text-muted-foreground">Beauty care that fits around your day.</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border p-6">
            <span className="grid size-11 place-items-center rounded-lg bg-rose-50 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}