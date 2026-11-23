import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SERVICE_CATEGORIES, SITE } from "@/lib/constants";
import Logo from "@/components/shared/Logo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + social */}
        <div>
             <Logo className="text-white" accentClassName="text-rose-400" />
          <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">{SITE.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {SITE.socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-700 px-3 py-1 text-xs transition hover:border-rose-400 hover:text-rose-400"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-semibold text-white">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {quickLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-rose-400">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-white">Categories</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {SERVICE_CATEGORIES.map(({ value, label }) => (
              <li key={value}>
                <Link href={`/services?category=${value}`} className="transition hover:text-rose-400">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + hours */}
        <div>
          <h3 className="font-semibold text-white">Contact Us</h3>
          <ul className="mt-5 space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-rose-400" />
              <a href={`mailto:${SITE.email}`} className="hover:text-rose-400">{SITE.email}</a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-rose-400" />
              <a href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`} className="hover:text-rose-400">{SITE.phone}</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-rose-400" />
              <span>{SITE.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-rose-400" />
              <span>{SITE.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-5 py-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
