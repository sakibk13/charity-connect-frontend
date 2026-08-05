"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialActionState } from "@/lib/action-state";
import { updateZakatSetting } from "@/lib/admin-actions";

export function ZakatSettingsForm({ currentNisab }: { currentNisab: number }) {
  const [state, formAction, pending] = useActionState(updateZakatSetting, initialActionState);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nisab_value">Nisab value (USD)</Label>
        <Input
          id="nisab_value"
          name="nisab_value"
          type="number"
          min={1}
          step="0.01"
          required
          defaultValue={currentNisab}
        />
        <p className="text-xs text-muted-foreground">
          Shown to every visitor using the Zakat calculator. Update it when the gold/silver market
          rate changes.
        </p>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Update Nisab value"}
      </Button>
      {state.status !== "idle" && (
        <p
          className={
            state.status === "error" ? "text-sm text-destructive" : "text-sm text-emerald-600"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
