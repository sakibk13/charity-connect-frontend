"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUploadUrl } from "@/lib/admin-actions";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function ImageUploadField({
  name,
  label = "Image",
  defaultValue,
}: {
  name: string;
  label?: string;
  defaultValue?: string | null;
}) {
  const inputId = useId();
  const [imageUrl, setImageUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please choose a JPEG, PNG, WEBP, or GIF image.");
      return;
    }

    setUploading(true);
    try {
      const result = await getUploadUrl(file.type);
      if (!result.ok) throw new Error(result.message);
      const { upload_url, public_url } = result.data;

      const putRes = await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload to storage failed.");

      setImageUrl(public_url);
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <input type="hidden" name={name} value={imageUrl} />

      <div className="flex items-center gap-4">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary/dynamic storage host, not worth remotePatterns config yet
          <img
            src={imageUrl}
            alt=""
            className="h-16 w-24 rounded-md border object-cover"
          />
        ) : (
          <div className="flex h-16 w-24 items-center justify-center rounded-md border border-dashed text-muted-foreground">
            <ImagePlus className="h-5 w-5" />
          </div>
        )}

        <div>
          <Button
            render={<label htmlFor={inputId} className="cursor-pointer" />}
            nativeButton={false}
            variant="outline"
            size="sm"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : imageUrl ? (
              "Replace image"
            ) : (
              "Upload image"
            )}
          </Button>
          <input
            id={inputId}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            className="hidden"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Fallback while object storage isn't configured: paste a hosted
       * image URL directly (same mechanism the seed data used). */}
      <Input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Or paste an image URL (e.g. an Unsplash link)"
        disabled={uploading}
      />
    </div>
  );
}
