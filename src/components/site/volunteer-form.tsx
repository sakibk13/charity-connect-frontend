"use client";

import { useActionState, useEffect } from "react";

import { useToast } from "@/components/site/toast-provider";
import { applyAsVolunteer } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import type { Campaign } from "@/lib/types";

export function VolunteerForm({ campaigns }: { campaigns: Campaign[] }) {
  const showToast = useToast();
  const [state, formAction, pending] = useActionState(applyAsVolunteer, initialActionState);

  useEffect(() => {
    if (state.status === "idle") return;
    showToast(
      state.status === "success" ? "Application Received" : "Submission Failed",
      state.message ?? "",
      state.status
    );
  }, [state, showToast]);

  return (
    <form action={formAction}>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="vol-name">Full Name</label>
        <input id="vol-name" name="name" required className="pt-form-input" placeholder="Jane Smith" />
      </div>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="vol-email">Email Address</label>
        <input id="vol-email" name="email" type="email" required className="pt-form-input" placeholder="jane@example.com" />
      </div>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="vol-phone">Phone Number</label>
        <input id="vol-phone" name="phone" required className="pt-form-input" placeholder="+1 (555) 019-2834" />
      </div>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="vol-interest">Preferred Focus Area</label>
        <select id="vol-interest" name="interest_campaign_id" className="pt-form-select">
          <option value="">General / Anywhere Needed</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="vol-skills">Skills &amp; Qualifications</label>
        <textarea
          id="vol-skills"
          name="skills"
          required
          className="pt-form-textarea"
          placeholder="Tell us about your background, relevant qualifications, or what drives you to volunteer..."
        />
      </div>
      <button type="submit" disabled={pending} className="pt-btn pt-btn-accent pt-btn-full" style={{ marginTop: 10 }}>
        {pending ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
