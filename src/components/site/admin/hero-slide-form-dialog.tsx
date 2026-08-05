"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialActionState } from "@/lib/action-state";
import { createHeroSlide, updateHeroSlide } from "@/lib/admin-actions";
import type { HeroSlide } from "@/lib/types";
import { ImageUploadField } from "@/components/site/admin/image-upload-field";

function HeroSlideForm({ slide, onSuccess }: { slide?: HeroSlide; onSuccess: () => void }) {
  const action = slide ? updateHeroSlide.bind(null, slide.id) : createHeroSlide;
  const [state, formAction, pending] = useActionState(action, initialActionState);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hs-headline">Headline</Label>
        <Input id="hs-headline" name="headline" required defaultValue={slide?.headline} placeholder="Give Safe Water" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hs-badge">Badge text</Label>
        <Input id="hs-badge" name="badge_text" required defaultValue={slide?.badge_text} placeholder="Give Sadaqah" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hs-cta-label">Button label</Label>
          <Input id="hs-cta-label" name="cta_label" required defaultValue={slide?.cta_label} placeholder="Donate Now" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hs-cta-href">Button link</Label>
          <Input id="hs-cta-href" name="cta_href" required defaultValue={slide?.cta_href} placeholder="/campaigns" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="hs-sort-order">Display order (lower shows first)</Label>
        <Input id="hs-sort-order" name="sort_order" type="number" defaultValue={slide?.sort_order ?? 0} />
      </div>
      <ImageUploadField name="image_key" label="Slide background image" defaultValue={slide?.image_key} />
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : slide ? "Save changes" : "Add slide"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function HeroSlideFormDialog({
  slide,
  trigger,
}: {
  slide?: HeroSlide;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{slide ? "Edit slide" : "Add hero slide"}</DialogTitle>
        </DialogHeader>
        {open && <HeroSlideForm slide={slide} onSuccess={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
