"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import { deleteService } from "@/lib/actions/services";
import { getCategoryLabel } from "@/lib/constants";
import { notify } from "@/lib/notify";
import { cn, formatPrice } from "@/lib/utils";

export default function ServicesTable({ services }) {
  const router = useRouter();
  const [target, setTarget] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const service = target;
    startTransition(async () => {
      notify(await deleteService(service._id), router);
      setTarget(null);
    });
  }

  if (services.length === 0) {
    return (
      <EmptyState
        icon={Scissors}
        title="No services yet"
        text="Add your first service so customers can book it."
        action={<Link href="/dashboard/admin/services/add" className={buttonVariants()}>Add service</Link>}
      />
    );
  }

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={service.image} alt="" fill unoptimized className="object-cover" />
                    </div>
                    <span className="max-w-48 truncate font-medium">{service.name}</span>
                  </div>
                </TableCell>
                <TableCell>{getCategoryLabel(service.category)}</TableCell>
                <TableCell>{formatPrice(service.price)}</TableCell>
                <TableCell>{service.duration} min</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      service.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
                    )}
                  >
                    {service.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/admin/services/${service._id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      Edit
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => setTarget(service)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Delete this service?"
        description={`"${target?.name ?? ""}" will be removed permanently. Services with pending or confirmed appointments cannot be deleted (set them to inactive instead).`}
        confirmLabel="Delete"
        destructive
        loading={isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}