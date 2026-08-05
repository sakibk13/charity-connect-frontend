import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "@/lib/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveImageUrl(key: string | null | undefined): string {
  if (!key) return "";
  let url = key.trim();
  if (url.includes("localhost")) {
    url = url.replace(/^https?:\/\/[^\/]+/, "");
  }
  if (url.startsWith("/static/") || url.startsWith("static/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${env.apiUrl}${cleanPath}`;
  }
  return url;
}
