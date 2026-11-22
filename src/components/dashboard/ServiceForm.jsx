"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import FormField from "@/components/shared/FormField";
import ImageField from "@/components/shared/ImageField";
import { createService, updateService } from "@/lib/actions/services";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { notify } from "@/lib/notify";
import { getFieldErrors } from "@/lib/validators/common";
import { serviceFormSchema } from "@/lib/validators/service";

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

const toValues = (service) => ({
  name: service?.name ?? "",
  category: service?.category ?? "",
  price: service?.price != null ? String(service.price) : "",
  duration: service?.duration != null ? String(service.duration) : "",
  description: service?.description ?? "",
  image: service?.image ?? "",
  status: service?.status ?? "active",
});

// Pass `service` to edit, nothing to add.
export default function ServiceForm({ service }) {
  const router = useRouter();
  const isEdit = Boolean(service);
  const [values, setValues] = useState(() => toValues(service));
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition();

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  function handleSubmit(event) {
    event.preventDefault();

    const parsed = serviceFormSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setErrors({});
    startTransition(async () => {
      const result = isEdit ? await updateService(service._id, parsed.data) : await createService(parsed.data);
      if (result.errors) setErrors(result.errors);
      if (notify(result, router)) router.push("/dashboard/admin/services");
    });
  }

  return (
    <Card className="max-w-3xl">
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="name" label="Service name" error={errors.name?.[0]}>
              <Input id="name" value={values.name} onChange={(e) => update("name", e.target.value)} disabled={isPending} className="h-10" aria-invalid={!!errors.name} />
            </FormField>

            <FormField id="category" label="Category" error={errors.category?.[0]}>
              <select id="category" value={values.category} onChange={(e) => update("category", e.target.value)} disabled={isPending} className={selectClass} aria-invalid={!!errors.category}>
                <option value="">Choose a category</option>
                {SERVICE_CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </FormField>

            <FormField id="price" label="Price (৳)" error={errors.price?.[0]}>
              <Input id="price" type="number" min="1" step="any" inputMode="decimal" value={values.price} onChange={(e) => update("price", e.target.value)} disabled={isPending} className="h-10" aria-invalid={!!errors.price} />
            </FormField>

            <FormField id="duration" label="Duration (minutes)" error={errors.duration?.[0]}>
              <Input id="duration" type="number" min="1" step="1" inputMode="numeric" value={values.duration} onChange={(e) => update("duration", e.target.value)} disabled={isPending} className="h-10" aria-invalid={!!errors.duration} />
            </FormField>
          </div>

          <FormField id="description" label="Description" error={errors.description?.[0]}>
            <Textarea id="description" rows={4} value={values.description} onChange={(e) => update("description", e.target.value)} disabled={isPending} aria-invalid={!!errors.description} />
          </FormField>

          <ImageField id="image" label="Image" uploadOnly value={values.image} onChange={(value) => update("image", value)} error={errors.image?.[0]} disabled={isPending} /> 

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">Inactive services are hidden from customers and cannot be booked.</p>
            </div>
            <Switch
              aria-label="Service is active"
              checked={values.status === "active"}
              onCheckedChange={(checked) => update("status", checked ? "active" : "inactive")}
              disabled={isPending}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="h-10" disabled={isPending}>
              {isPending ? "Saving…" : isEdit ? "Update service" : "Add service"}
            </Button>
            <Button type="button" variant="outline" className="h-10" disabled={isPending} onClick={() => router.push("/dashboard/admin/services")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}