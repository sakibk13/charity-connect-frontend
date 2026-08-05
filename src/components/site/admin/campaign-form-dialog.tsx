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
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/action-state";
import { createCampaign, updateCampaign } from "@/lib/admin-actions";
import type { Campaign } from "@/lib/types";
import { ImageUploadField } from "@/components/site/admin/image-upload-field";

function CampaignForm({
  campaign,
  onSuccess,
}: {
  campaign?: Campaign;
  onSuccess: () => void;
}) {
  const action = campaign ? updateCampaign.bind(null, campaign.id) : createCampaign;
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
        <Label htmlFor="c-title">Title</Label>
        <Input id="c-title" name="title" required defaultValue={campaign?.title} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-description">Description</Label>
        <Textarea
          id="c-description"
          name="description"
          required
          defaultValue={campaign?.description}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="c-category">Category</Label>
          <Input id="c-category" name="category" required defaultValue={campaign?.category} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-goal">Goal (USD)</Label>
          <Input
            id="c-goal"
            name="goal"
            type="number"
            min={1}
            step="0.01"
            required
            defaultValue={campaign?.goal}
          />
        </div>
      </div>
      <ImageUploadField name="image_key" label="Campaign image" defaultValue={campaign?.image_key} />
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : campaign ? "Save changes" : "Launch campaign"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CampaignFormDialog({
  campaign,
  trigger,
}: {
  campaign?: Campaign;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{campaign ? "Edit campaign" : "Create campaign"}</DialogTitle>
        </DialogHeader>
        {open && <CampaignForm campaign={campaign} onSuccess={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
