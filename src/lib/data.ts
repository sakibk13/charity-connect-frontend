import { ApiError, apiFetch } from "@/lib/api";
import type {
  BlogPost,
  Campaign,
  Donation,
  EventItem,
  GalleryPhoto,
  HeroSlide,
  Volunteer,
  ZakatSetting,
} from "@/lib/types";

function query(params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) qs.set(key, value);
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

async function getOrNull<T>(path: string): Promise<T | null> {
  try {
    return await apiFetch<T>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// Campaigns
export function getCampaigns(params?: { search?: string; category?: string }) {
  return apiFetch<Campaign[]>(`/api/v1/campaigns${query(params ?? {})}`);
}

export function getCampaign(slug: string) {
  return getOrNull<Campaign>(`/api/v1/campaigns/${slug}`);
}

// Events
export function getEvents(params?: { search?: string }) {
  return apiFetch<EventItem[]>(`/api/v1/events${query(params ?? {})}`);
}

export function getEvent(slug: string) {
  return getOrNull<EventItem>(`/api/v1/events/${slug}`);
}

// Blog
export function getBlogPosts(params?: { category?: string; campaign_id?: string }) {
  return apiFetch<BlogPost[]>(`/api/v1/blog${query(params ?? {})}`);
}

export function getBlogPost(slug: string) {
  return getOrNull<BlogPost>(`/api/v1/blog/${slug}`);
}

// Zakat
export function getZakatSetting() {
  return apiFetch<ZakatSetting>("/api/v1/zakat-settings");
}

// Hero slides
export function getHeroSlides() {
  return apiFetch<HeroSlide[]>("/api/v1/hero-slides");
}

// Gallery photos
export function getGalleryPhotos(params?: { category?: string }) {
  return apiFetch<GalleryPhoto[]>(`/api/v1/gallery-photos${query(params ?? {})}`);
}

// Donations
export function getDonationsByIds(ids: string[]) {
  if (ids.length === 0) return Promise.resolve<Donation[] | null>(null);
  return getOrNull<Donation[]>(`/api/v1/donations/by-ids?ids=${ids.join(",")}`);
}

// Admin-only reads (require a bearer token — see lib/auth.ts:getAccessToken)
export function getAdminCampaigns(token: string) {
  return apiFetch<Campaign[]>("/api/v1/campaigns?include_inactive=true", { token });
}

export function getAdminHeroSlides(token: string) {
  return apiFetch<HeroSlide[]>("/api/v1/hero-slides?include_inactive=true", { token });
}

export function getAdminGalleryPhotos(token: string) {
  return apiFetch<GalleryPhoto[]>("/api/v1/gallery-photos", { token });
}

export function getAdminDonations(token: string) {
  return apiFetch<Donation[]>("/api/v1/donations", { token });
}

export function getAdminBlogPosts(token: string) {
  return apiFetch<BlogPost[]>("/api/v1/blog?limit=200", { token });
}

export function getVolunteers(token: string, status?: string) {
  return apiFetch<Volunteer[]>(`/api/v1/volunteers${query({ status_filter: status })}`, {
    token,
  });
}
