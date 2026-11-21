import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="mt-5 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Sorry, the page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className={buttonVariants({ size: "lg", className: "mt-7 h-11 px-7" })}>
        Back to home
      </Link>
    </section>
  );
}