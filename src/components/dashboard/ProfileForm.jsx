"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FormField from "@/components/shared/FormField";
import ImageField from "@/components/shared/ImageField";
import { updateProfile } from "@/lib/actions/users";
import { notify } from "@/lib/notify";
import { getFieldErrors } from "@/lib/validators/common";
import { profileSchema } from "@/lib/validators/profile";

// Used by the customer and the admin. There is no role / blocked field anywhere in this form.
export default function ProfileForm({ user }) {
  const router = useRouter();
  const [values, setValues] = useState({ name: user.name ?? "", phone: user.phone ?? "", image: user.image ?? "" });
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition();

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  function handleSubmit(event) {
    event.preventDefault();

    const parsed = profileSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setErrors({});
    startTransition(async () => {
      const result = await updateProfile(parsed.data);
      if (result.errors) setErrors(result.errors);
      if (notify(result, router)) router.refresh();
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="email" label="Email" hint="Your email cannot be changed.">
            <Input id="email" value={user.email} readOnly disabled className="h-10" />
          </FormField>

          <FormField id="name" label="Full name" error={errors.name?.[0]}>
            <Input id="name" value={values.name} onChange={(e) => update("name", e.target.value)} disabled={isPending} className="h-10" aria-invalid={!!errors.name} />
          </FormField>

          <FormField id="phone" label="Phone" error={errors.phone?.[0]} hint="Bangladesh mobile number, e.g. 01712345678">
            <Input id="phone" type="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} disabled={isPending} className="h-10" aria-invalid={!!errors.phone} />
          </FormField>

          <ImageField id="image" label="Profile image" value={values.image} onChange={(value) => update("image", value)} error={errors.image?.[0]} disabled={isPending} />

          <Button type="submit" className="h-10" disabled={isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}