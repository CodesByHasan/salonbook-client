import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-7xl font-bold text-rose-500">404</p>

      <h1 className="mt-5 text-3xl font-bold">
        Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-gray-500">
        Sorry, the page you are looking for does not exist or may have
        been moved.
      </p>

      <Link
        href="/"
        className="mt-7 rounded-full bg-rose-500 px-7 py-3 font-semibold text-white hover:bg-rose-600"
      >
        Back to Home
      </Link>
    </section>
  );
}