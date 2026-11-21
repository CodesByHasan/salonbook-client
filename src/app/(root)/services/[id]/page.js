import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import BookingForm from "@/components/services/BookingForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceById } from "@/lib/api/services";
import { getCategoryLabel } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { formatPrice, todayInDhaka } from "@/lib/utils";

export const metadata = { title: "Service Details" };

const Notice = ({ children }) => (
  <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{children}</p>
);

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params;

  // Protected page: guests sign in first, then come straight back here.
  const session = await getSession();
  if (!session) redirect(`/sign-in?redirect=${encodeURIComponent(`/services/${id}`)}`);

  // null = invalid id or no such service -> ./not-found.js shows the error message.
  const service = await getServiceById(id);
  if (!service) notFound();

  const isAdmin = session.user.role === "admin";
  const isActive = service.status === "active";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/services" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to services
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
            <Image src={service.image} alt={service.name} fill unoptimized priority className="object-cover" />
          </div>

          <div className="space-y-4">
            <Badge variant="secondary">{getCategoryLabel(service.category)}</Badge>
            <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-2xl font-bold text-primary">{formatPrice(service.price)}</span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4" /> {service.duration} minutes
              </span>
            </div>

            <p className="leading-7 whitespace-pre-line text-muted-foreground">{service.description}</p>
          </div>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-lg">Book this service</CardTitle>
            <CardDescription>Your request stays pending until the salon confirms it.</CardDescription>
          </CardHeader>
          <CardContent>
            {isAdmin ? (
              <Notice>Admin accounts cannot book appointments.</Notice>
            ) : !isActive ? (
              <Notice>This service is currently unavailable.</Notice>
            ) : (
              <BookingForm serviceId={service._id} minDate={todayInDhaka()} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}