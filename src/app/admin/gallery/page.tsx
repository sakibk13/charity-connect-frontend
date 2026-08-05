import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ActionButton } from "@/components/site/admin/action-button";
import { GalleryFormDialog } from "@/components/site/admin/gallery-form-dialog";
import { deleteGalleryPhoto } from "@/lib/admin-actions";
import { getAccessToken } from "@/lib/auth";
import { getAdminGalleryPhotos } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const token = (await getAccessToken())!;
  const photos = await getAdminGalleryPhotos(token);
  const existingCategories = Array.from(new Set(photos.map((p) => p.category))).sort();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Photo Gallery</h1>
          <p className="text-sm text-muted-foreground">
            Photos shown in the &ldquo;Making a Difference&rdquo; gallery on the homepage, grouped
            by initiative.
          </p>
        </div>
        <GalleryFormDialog
          existingCategories={existingCategories}
          trigger={<Button className="rounded-full">+ Add Photo</Button>}
        />
      </div>

      {photos.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          No photos yet — add the first one for the homepage gallery.
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary/dynamic storage host */}
              <img
                src={photo.image_key}
                alt={photo.alt_text ?? ""}
                className="h-40 w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 p-3">
                <Badge variant="secondary">{photo.category}</Badge>
                <ActionButton
                  action={deleteGalleryPhoto.bind(null, photo.id)}
                  variant="destructive"
                  size="sm"
                  confirmMessage="Delete this photo? This cannot be undone."
                  successMessage="Photo deleted."
                >
                  Delete
                </ActionButton>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
