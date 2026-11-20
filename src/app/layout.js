import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import Navbar from "@/components/shared/Navbar.jsx";
import Footer from "@/components/shared/Footer.jsx";

export const metadata = {
  title: {
    default: "SalonBook | Salon Appointment Booking",
    template: "%s | SalonBook",
  },
  description:
    "Discover salon services and book your next appointment with SalonBook.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <TooltipProvider>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
