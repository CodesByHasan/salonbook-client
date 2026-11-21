import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/signin", label: "Sign In" },
  { href: "/signup", label: "Sign Up" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="text-2xl font-bold text-white">
            Salon<span className="text-rose-400">Book</span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
            Your beauty, our priority. Discover professional salon services
            and book your next appointment with ease.
          </p>

          <div className="mt-5 flex gap-4">
            {socialLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition hover:text-rose-400"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white">Quick Links</h3>

          <ul className="mt-5 space-y-3 text-sm">
            {quickLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-rose-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-white">Contact Us</h3>

          <ul className="mt-5 space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-rose-400" />
              <span>your-email@example.com</span>
            </li>

            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-rose-400" />
              <span>Your contact number</span>
            </li>

            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-rose-400" />
              <span>Your salon address</span>
            </li>
          </ul>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 className="font-semibold text-white">Opening Hours</h3>

          <div className="mt-5 flex items-start gap-3 text-sm text-gray-400">
            <Clock className="mt-0.5 size-4 shrink-0 text-rose-400" />

            <div className="space-y-2">
              <p>Saturday – Thursday</p>
              <p>10:00 AM – 9:00 PM</p>
              <p className="text-rose-400">Friday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-center text-xs text-gray-500 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} SalonBook. All rights reserved.
          </p>

          <p>Designed for a better salon experience.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
