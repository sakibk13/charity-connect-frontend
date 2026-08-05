import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/site/admin/action-button";
import { HeroSlideFormDialog } from "@/components/site/admin/hero-slide-form-dialog";
import { getAccessToken } from "@/lib/auth";
import { getAdminHeroSlides } from "@/lib/data";
import { deleteHeroSlide, setHeroSlideActive } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminHeroSlidesPage() {
  const token = (await getAccessToken())!;
  const slides = await getAdminHeroSlides(token);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Homepage Hero Slides</h1>
          <p className="text-sm text-muted-foreground">
            These images and headlines rotate on the homepage hero banner, in display-order.
          </p>
        </div>
        <HeroSlideFormDialog trigger={<Button className="rounded-full">+ Add Slide</Button>} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Headline</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hero slides yet — add up to 5 for the homepage banner.
                </TableCell>
              </TableRow>
            )}
            {slides.map((slide) => (
              <TableRow key={slide.id}>
                <TableCell>
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary/dynamic storage host */}
                  <img
                    src={slide.image_key}
                    alt=""
                    className="h-12 w-20 rounded-md border object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{slide.headline}</TableCell>
                <TableCell>{slide.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={slide.active ? "default" : "secondary"}>
                    {slide.active ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <HeroSlideFormDialog
                    slide={slide}
                    trigger={
                      <Button variant="outline" size="sm" className="rounded-full">
                        Edit
                      </Button>
                    }
                  />
                  <ActionButton
                    action={setHeroSlideActive.bind(null, slide.id, !slide.active)}
                    variant={slide.active ? "destructive" : "outline"}
                    successMessage={slide.active ? "Slide hidden." : "Slide shown."}
                  >
                    {slide.active ? "Hide" : "Show"}
                  </ActionButton>
                  <ActionButton
                    action={deleteHeroSlide.bind(null, slide.id)}
                    variant="destructive"
                    confirmMessage="Delete this slide? This cannot be undone."
                    successMessage="Slide deleted."
                  >
                    Delete
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
