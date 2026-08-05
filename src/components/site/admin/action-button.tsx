"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ActionButton({
  action,
  children,
  variant = "outline",
  size = "sm",
  confirmMessage,
  successMessage,
}: {
  action: () => Promise<void>;
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  confirmMessage?: string;
  successMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    startTransition(async () => {
      try {
        await action();
        if (successMessage) toast.success(successMessage);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong.");
      }
    });
  };

  return (
    <Button variant={variant} size={size} className="rounded-full" onClick={handleClick} disabled={pending}>
      {children}
    </Button>
  );
}
