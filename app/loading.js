export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />

        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading SalonBook...
        </p>
      </div>
    </div>
  );
}