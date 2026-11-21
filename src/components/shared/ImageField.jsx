"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormField from "@/components/shared/FormField";
import { uploadImage } from "@/lib/upload";

export default function ImageField({ id, label, value, onChange, error, disabled }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Image uploaded.");
    } catch (uploadError) {
      toast.error(uploadError.message || "Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const canPreview = /^https?:\/\/.+/i.test(value);

  return (
    <FormField id={id} label={label} error={error}>
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://..."
          disabled={disabled || uploading}
          className="h-10"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <Button type="button" variant="outline" className="h-10" disabled={disabled || uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? "Uploading…" : "Upload"}
        </Button>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      </div>

      {canPreview && (
        <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-lg border bg-muted">
          <Image src={value} alt="Preview" fill unoptimized className="object-cover" />
        </div>
      )}
    </FormField>
  );
}