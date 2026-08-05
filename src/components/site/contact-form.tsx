"use client";

import { useActionState, useEffect } from "react";

import { useToast } from "@/components/site/toast-provider";
import { submitContactMessage } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";

export function ContactForm() {
  const showToast = useToast();
  const [state, formAction, pending] = useActionState(submitContactMessage, initialActionState);

  useEffect(() => {
    if (state.status === "idle") return;
    showToast(
      state.status === "success" ? "Inquiry Received" : "Submission Failed",
      state.message ?? "",
      state.status
    );
  }, [state, showToast]);

  return (
    <form action={formAction}>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="contact-name">Your Name</label>
        <input id="contact-name" name="name" required className="pt-form-input" placeholder="e.g. Alex Johnson" />
      </div>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="contact-email">Email Address</label>
        <input id="contact-email" name="email" type="email" required className="pt-form-input" placeholder="e.g. alex@example.com" />
      </div>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="contact-message">Message Details</label>
        <textarea id="contact-message" name="message" required className="pt-form-textarea" placeholder="Write your message here..." />
      </div>
      <button type="submit" disabled={pending} className="pt-btn pt-btn-primary pt-btn-full" style={{ marginTop: 10 }}>
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
