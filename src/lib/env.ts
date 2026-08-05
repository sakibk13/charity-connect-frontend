export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "8801938820835",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
};
