import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

// Layout for the public pages: Navbar + page + Footer.
export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}