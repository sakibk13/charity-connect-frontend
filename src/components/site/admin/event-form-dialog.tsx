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
import { createEvent, updateEvent } from "@/lib/admin-actions";
import type { EventItem } from "@/lib/types";
import { ImageUploadField } from "@/components/site/admin/image-upload-field";

function EventForm({ event, onSuccess }: { event?: EventItem; onSuccess: () => void }) {
  const action = event ? updateEvent.bind(null, event.id) : createEvent;
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
        <Label htmlFor="e-title">Title</Label>
        <Input id="e-title" name="title" required defaultValue={event?.title} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="e-description">Description</Label>
        <Textarea id="e-description" name="description" required defaultValue={event?.description} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="e-date">Date</Label>
          <Input id="e-date" name="date" type="date" required defaultValue={event?.date} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="e-time">Time</Label>
          <Input
            id="e-time"
            name="time"
            required
            placeholder="09:00 AM - 01:00 PM"
            defaultValue={event?.time}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="e-location">Location</Label>
        <Input id="e-location" name="location" required defaultValue={event?.location} />
      </div>
      <ImageUploadField name="image_key" label="Event image" defaultValue={event?.image_key} />
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : event ? "Save changes" : "Schedule event"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EventFormDialog({
  event,
  trigger,
}: {
  event?: EventItem;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit event" : "Schedule new event"}</DialogTitle>
        </DialogHeader>
        {open && <EventForm event={event} onSuccess={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
