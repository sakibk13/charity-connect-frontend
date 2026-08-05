import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "@/lib/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveImageUrl(key: string | null | undefined): string {
  if (!key) return "";
  let url = key.trim();

  // Campaign images are stored in /public on Vercel — serve directly from CDN
  // These are paths like /static/campaigns/aqua-aid.jpg or https://.../.../aqua-aid.jpg
  const isCampaignImage =
    url.includes("/static/campaigns/") || url.includes("\\static\\campaigns\\");
  const isHeroImage =
    url.includes("/static/hero-slides/") || url.includes("\\static\\hero-slides\\");

  if (isCampaignImage) {
    // Extract just the filename and serve from public/ (deployed on Vercel CDN)
    const filename = url.split("/").pop()?.split("?")[0] || "";
    if (filename) return `/${filename}`;
  }

  if (isHeroImage) {
    // Extract just the filename and serve from public/ (deployed on Vercel CDN)
    const filename = url.split("/").pop()?.split("?")[0] || "";
    if (filename) return `/${filename}`;
  }

  // Strip localhost host for gallery/event/blog images — use backend API URL
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    url = url.replace(/^https?:\/\/[^/]+/, "");
  }
  if (url.startsWith("/static/") || url.startsWith("static/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${env.apiUrl}${cleanPath}`;
  }
  return url;
}
