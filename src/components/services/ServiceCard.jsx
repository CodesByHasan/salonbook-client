import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryLabel } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export default function ServiceCard({ service }) {
  return (
    <Card className="h-full gap-0 py-0 transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full bg-muted">
        {/* unoptimized: admins can paste any image host, so skip the Next image optimizer. */}
        <Image src={service.image} alt={service.name} fill unoptimized className="object-cover" />
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <Badge variant="secondary" className="w-fit">{getCategoryLabel(service.category)}</Badge>

        <h3 className="line-clamp-1 text-base font-semibold">{service.name}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{service.description}</p>

        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">{formatPrice(service.price)}</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3.5" />
            {service.duration} min
          </span>
        </div>

        <Link href={`/services/${service._id}`} className={buttonVariants({ className: "h-9 w-full" })}>
          View Details
        </Link>
      </CardContent>
    </Card>
  );
}