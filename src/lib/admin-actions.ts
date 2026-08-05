"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ApiError, apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { ActionState } from "@/lib/action-state";

async function requireToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) redirect("/login");
  return token;
}

function fail(error: unknown): ActionState {
  return {
    status: "error",
    message: error instanceof ApiError ? error.message : "Something went wrong.",
  };
}

// ---------- Image uploads ----------

interface PresignResponse {
  upload_url: string;
  public_url: string;
  object_key: string;
}

type PresignResult =
  | { ok: true; data: PresignResponse }
  | { ok: false; message: string };

/** Called client-side before uploading a file: returns a short-lived presigned
 * PUT URL. The actual file bytes go straight from the browser to the bucket —
 * this action (and the API behind it) never sees them.
 *
 * Errors are returned rather than thrown: a thrown error crosses the Server
 * Action boundary uncaught and Next.js replaces the message with an opaque
 * "Server Components render" + digest string, hiding the real cause (e.g. an
 * expired admin session) from the user. */
export async function getUploadUrl(contentType: string): Promise<PresignResult> {
  const token = await requireToken();
  try {
    const data = await apiFetch<PresignResponse>("/api/v1/uploads/presign", {
      method: "POST",
      token,
      body: { content_type: contentType },
    });
    return { ok: true, data };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { ok: false, message: "Your session has expired. Please log in again." };
    }
    return { ok: false, message: error instanceof ApiError ? error.message : "Upload failed." };
  }
}

// ---------- Campaigns ----------

export async function createCampaign(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = await requireToken();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const goal = Number(formData.get("goal") ?? 0);
  const image_key = String(formData.get("image_key") ?? "").trim() || undefined;

  if (!title || !description || !category || !(goal > 0)) {
    return { status: "error", message: "Please fill in every field with a positive goal." };
  }

  try {
    await apiFetch("/api/v1/campaigns", {
      method: "POST",
      token,
      body: { title, description, category, goal, image_key },
    });
  } catch (error) {
    return fail(error);
  }

  revalidatePath("/admin/campaigns");
  revalidatePath("/campaigns");
  revalidatePath("/");
  return { status: "success", message: "Campaign created." };
}

export async function updateCampaign(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = await requireToken();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const goal = Number(formData.get("goal") ?? 0);
  const image_key = String(formData.get("image_key") ?? "").trim() || undefined;

  if (!title || !description || !category || !(goal > 0)) {
    return { status: "error", message: "Please fill in every field with a positive goal." };
  }

  try {
    await apiFetch(`/api/v1/campaigns/${id}`, {
      method: "PATCH",
      token,
      body: { title, description, category, goal, image_key },
    });
  } catch (error) {
    return fail(error);
  }

  revalidatePath("/admin/campaigns");
  revalidatePath("/campaigns");
  revalidatePath("/");
  return { status: "success", message: "Campaign updated." };
}

export async function setCampaignActive(id: string, active: boolean): Promise<void> {
  const token = await requireToken();
  await apiFetch(`/api/v1/campaigns/${id}`, { method: "PATCH", token, body: { active } });
  revalidatePath("/admin/campaigns");
  revalidatePath("/campaigns");
  revalidatePath("/");
}

// ---------- Events ----------

export async function createEvent(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = await requireToken();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const image_key = String(formData.get("image_key") ?? "").trim() || undefined;

  if (!title || !description || !date || !time || !location) {
    return { status: "error", message: "Please fill in every field." };
  }

  try {
    await apiFetch("/api/v1/events", {
      method: "POST",
      token,
      body: { title, description, date, time, location, image_key },
    });
  } catch (error) {
    return fail(error);
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { status: "success", message: "Event created." };
}

export async function updateEvent(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = await requireToken();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const image_key = String(formData.get("image_key") ?? "").trim() || undefined;

  if (!title || !description || !date || !time || !location) {
    return { status: "error", message: "Please fill in every field." };
  }

  try {
    await apiFetch(`/api/v1/events/${id}`, {
      method: "PATCH",
      token,
      body: { title, description, date, time, location, image_key },
    });
  } catch (error) {
    return fail(error);
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { status: "success", message: "Event updated." };
}

export async function deleteEvent(id: string): Promise<void> {
  const token = await requireToken();
  await apiFetch(`/api/v1/events/${id}`, { method: "DELETE", token });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

// ---------- Blog ----------

export async function createBlogPost(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = await requireToken();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const campaign_id = String(formData.get("campaign_id") ?? "").trim() || undefined;
  const image_key = String(formData.get("image_key") ?? "").trim() || undefined;
  const published = formData.get("published") === "on";

  if (!title || !summary || !content || !category) {
    return { status: "error", message: "Please fill in every field." };
  }

  try {
    await apiFetch("/api/v1/blog", {
      method: "POST",
      token,
      body: { title, summary, content, category, campaign_id, image_key, published },
    });
  } catch (error) {
    return fail(error);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  return { status: "success", message: "Post created." };
}

export async function updateBlogPost(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = await requireToken();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const campaign_id = String(formData.get("campaign_id") ?? "").trim() || undefined;
  const image_key = String(formData.get("image_key") ?? "").trim() || undefined;
  const published = formData.get("published") === "on";

  if (!title || !summary || !content || !category) {
    return { status: "error", message: "Please fill in every field." };
  }

  try {
    await apiFetch(`/api/v1/blog/${id}`, {
      method: "PATCH",
      token,
      body: { title, summary, content, category, campaign_id, image_key, published },
    });
  } catch (error) {
    return fail(error);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  return { status: "success", message: "Post updated." };
}

export async function deleteBlogPost(id: string): Promise<void> {
  const token = await requireToken();
  await apiFetch(`/api/v1/blog/${id}`, { method: "DELETE", token });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
}

// ---------- Hero slides ----------

export async function createHeroSlide(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = await requireToken();
  const headline = String(formData.get("headline") ?? "").trim();
  const badge_text = String(formData.get("badge_text") ?? "").trim();
  const cta_label = String(formData.get("cta_label") ?? "").trim();
  const cta_href = String(formData.get("cta_href") ?? "").trim();
  const image_key = String(formData.get("image_key") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);

  if (!headline || !badge_text || !cta_label || !cta_href || !image_key) {
    return { status: "error", message: "Please fill in every field and upload an image." };
  }

  try {
    await apiFetch("/api/v1/hero-slides", {
      method: "POST",
      token,
      body: { headline, badge_text, cta_label, cta_href, image_key, sort_order },
    });
  } catch (error) {
    return fail(error);
  }

  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  return { status: "success", message: "Slide created." };
}

export async function updateHeroSlide(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = await requireToken();
  const headline = String(formData.get("headline") ?? "").trim();
  const badge_text = String(formData.get("badge_text") ?? "").trim();
  const cta_label = String(formData.get("cta_label") ?? "").trim();
  const cta_href = String(formData.get("cta_href") ?? "").trim();
  const image_key = String(formData.get("image_key") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);

  if (!headline || !badge_text || !cta_label || !cta_href || !image_key) {
    return { status: "error", message: "Please fill in every field and upload an image." };
  }

  try {
    await apiFetch(`/api/v1/hero-slides/${id}`, {
      method: "PATCH",
      token,
      body: { headline, badge_text, cta_label, cta_href, image_key, sort_order },
    });
  } catch (error) {
    return fail(error);
  }

  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  return { status: "success", message: "Slide updated." };
}

export async function setHeroSlideActive(id: string, active: boolean): Promise<void> {
  const token = await requireToken();
  await apiFetch(`/api/v1/hero-slides/${id}`, { method: "PATCH", token, body: { active } });
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const token = await requireToken();
  await apiFetch(`/api/v1/hero-slides/${id}`, { method: "DELETE", token });
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
}

// ---------- Gallery photos ----------

export async function createGalleryPhoto(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = await requireToken();
  const image_key = String(formData.get("image_key") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const alt_text = String(formData.get("alt_text") ?? "").trim() || undefined;

  if (!image_key || !category) {
    return { status: "error", message: "Please upload an image and choose a category." };
  }

  try {
    await apiFetch("/api/v1/gallery-photos", {
      method: "POST",
      token,
      body: { image_key, category, alt_text },
    });
  } catch (error) {
    return fail(error);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { status: "success", message: "Photo added." };
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const token = await requireToken();
  await apiFetch(`/api/v1/gallery-photos/${id}`, { method: "DELETE", token });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

// ---------- Volunteers ----------

export async function setVolunteerStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<void> {
  const token = await requireToken();
  await apiFetch(`/api/v1/volunteers/${id}/status`, {
    method: "PATCH",
    token,
    body: { status },
  });
  revalidatePath("/admin/volunteers");
}

// ---------- Zakat settings ----------

export async function updateZakatSetting(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = await requireToken();
  const nisab_value = Number(formData.get("nisab_value") ?? 0);

  if (!(nisab_value > 0)) {
    return { status: "error", message: "Nisab value must be a positive number." };
  }

  try {
    await apiFetch("/api/v1/zakat-settings", {
      method: "PUT",
      token,
      body: { nisab_value },
    });
  } catch (error) {
    return fail(error);
  }

  revalidatePath("/admin/zakat");
  revalidatePath("/zakat");
  return { status: "success", message: "Nisab value updated." };
}
