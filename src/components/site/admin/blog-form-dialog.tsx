"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/action-state";
import { createBlogPost, updateBlogPost } from "@/lib/admin-actions";
import type { BlogPost, Campaign } from "@/lib/types";
import { ImageUploadField } from "@/components/site/admin/image-upload-field";

const CATEGORIES = ["Announcements", "Stories", "Impact Reports"];

function BlogForm({
  post,
  campaigns,
  onSuccess,
}: {
  post?: BlogPost;
  campaigns: Campaign[];
  onSuccess: () => void;
}) {
  const action = post ? updateBlogPost.bind(null, post.id) : createBlogPost;
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
        <Label htmlFor="p-title">Title</Label>
        <Input id="p-title" name="title" required defaultValue={post?.title} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="p-summary">Summary</Label>
        <Textarea id="p-summary" name="summary" required defaultValue={post?.summary} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="p-content">Content (HTML)</Label>
        <Textarea
          id="p-content"
          name="content"
          required
          rows={6}
          defaultValue={post?.content}
          placeholder="<p>Full article body…</p>"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="p-category">Category</Label>
          <Select name="category" defaultValue={post?.category ?? CATEGORIES[0]}>
            <SelectTrigger id="p-category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-campaign">Related campaign</Label>
          <Select name="campaign_id" defaultValue={post?.campaign_id ?? ""}>
            <SelectTrigger id="p-campaign" className="w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ImageUploadField name="image_key" label="Post image" defaultValue={post?.image_key} />
      <div className="flex items-center gap-2">
        <Checkbox id="p-published" name="published" defaultChecked={post?.published} />
        <Label htmlFor="p-published">Published</Label>
      </div>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function BlogFormDialog({
  post,
  campaigns,
  trigger,
}: {
  post?: BlogPost;
  campaigns: Campaign[];
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Edit post" : "Create post"}</DialogTitle>
        </DialogHeader>
        {open && <BlogForm post={post} campaigns={campaigns} onSuccess={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
