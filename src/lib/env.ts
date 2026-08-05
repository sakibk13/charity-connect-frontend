function getApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (raw && (raw.startsWith("http://") || raw.startsWith("https://"))) {
    return raw.endsWith("/") ? raw.slice(0, -1) : raw;
  }
  if (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    (typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("127.0.0.1"))
  ) {
    return "https://charity-connect-backend.onrender.com";
  }
  return "http://127.0.0.1:8000";
}

export const env = {
  apiUrl: getApiUrl(),
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "8801938820835",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "",
};
