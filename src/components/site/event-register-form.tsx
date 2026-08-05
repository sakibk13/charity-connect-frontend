"use client";

import { useActionState, useEffect } from "react";

import { useToast } from "@/components/site/toast-provider";
import { registerForEvent } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";

export function EventRegisterForm({ slug }: { slug: string }) {
  const showToast = useToast();
  const boundAction = registerForEvent.bind(null, slug);
  const [state, formAction, pending] = useActionState(boundAction, initialActionState);

  useEffect(() => {
    if (state.status === "idle") return;
    showToast(
      state.status === "success" ? "Registration Confirmed" : "Registration Failed",
      state.message ?? "",
      state.status
    );
  }, [state, showToast]);

  return (
    <form action={formAction}>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="name">Full Name</label>
        <input id="name" name="name" required className="pt-form-input" placeholder="Jane Smith" />
      </div>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" required className="pt-form-input" placeholder="jane@example.com" />
      </div>
      <button type="submit" disabled={pending} className="pt-btn pt-btn-primary pt-btn-full">
        {pending ? "Registering…" : "Register Now"}
      </button>
    </form>
  );
}
