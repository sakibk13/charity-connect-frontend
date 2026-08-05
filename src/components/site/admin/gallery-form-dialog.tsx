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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploadField } from "@/components/site/admin/image-upload-field";
import { initialActionState } from "@/lib/action-state";
import { createGalleryPhoto } from "@/lib/admin-actions";
import { GALLERY_CATEGORIES } from "@/components/site/photo-gallery";

function GalleryPhotoForm({
  existingCategories,
  onSuccess,
}: {
  existingCategories: string[];
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(createGalleryPhoto, initialActionState);
  const categoryOptions = Array.from(new Set([...existingCategories, ...GALLERY_CATEGORIES])).sort();
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0] ?? "");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <ImageUploadField name="image_key" label="Photo" />

      <div className="space-y-2">
        <Label>Initiative category</Label>
        <Tabs value={mode} onValueChange={(v) => setMode(v as "existing" | "new")}>
          <TabsList>
            <TabsTrigger value="existing">Choose existing</TabsTrigger>
            <TabsTrigger value="new">Create new</TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === "existing" ? (
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Community Programs"
          />
        )}
        <input type="hidden" name="category" value={mode === "existing" ? selectedCategory : newCategory} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gp-alt">Description (optional, for accessibility)</Label>
        <Input id="gp-alt" name="alt_text" placeholder="Volunteers distributing food aid" />
      </div>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add photo"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function GalleryFormDialog({
  trigger,
  existingCategories = [],
}: {
  trigger: React.ReactNode;
  existingCategories?: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add gallery photo</DialogTitle>
        </DialogHeader>
        {open && (
          <GalleryPhotoForm existingCategories={existingCategories} onSuccess={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
