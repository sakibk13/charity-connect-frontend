"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";
import type { ActionState } from "@/lib/action-state";

export async function registerForEvent(
  slug: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !email) {
    return { status: "error", message: "Name and email are required." };
  }

  try {
    await apiFetch(`/api/v1/events/${slug}/register`, {
      method: "POST",
      body: { name, email },
    });
    revalidatePath(`/events/${slug}`);
    return {
      status: "success",
      message: "You're registered for this event. See you there!",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof ApiError ? error.message : "Something went wrong.",
    };
  }
}

export async function applyAsVolunteer(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const skills = String(formData.get("skills") ?? "").trim();
  const interestCampaignId = String(formData.get("interest_campaign_id") ?? "").trim();

  if (!name || !email || !phone || !skills) {
    return { status: "error", message: "Please fill in every field." };
  }

  try {
    await apiFetch("/api/v1/volunteers", {
      method: "POST",
      body: {
        name,
        email,
        phone,
        skills,
        interest_campaign_id: interestCampaignId || null,
      },
    });
    return {
      status: "success",
      message:
        "Application received — our team will reach out to schedule a quick intro.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof ApiError ? error.message : "Something went wrong.",
    };
  }
}

export async function submitContactMessage(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in every field." };
  }

  try {
    await apiFetch("/api/v1/contact", {
      method: "POST",
      body: { name, email, message },
    });
    return { status: "success", message: "Thanks for reaching out — we'll reply soon." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof ApiError ? error.message : "Something went wrong.",
    };
  }
}
