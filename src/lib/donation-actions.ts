"use server";

import { ApiError, apiFetch } from "@/lib/api";

interface BillingAddressInput {
  country: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  county?: string;
  postcode: string;
}

interface ConfirmBasketInput {
  customer_id: string;
  payment_method_id: string;
  items: { campaign_id: string; amount_cents: number; frequency: "one_time" | "monthly" }[];
  cover_fee: boolean;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  dedication?: string;
  billing: BillingAddressInput;
}

export interface LegResult {
  frequency: "one_time" | "monthly";
  status: "succeeded" | "requires_action" | "failed";
  client_secret?: string;
  message?: string;
  donation_ids: string[];
}

export type SetupIntentResult =
  | { ok: true; customer_id: string; client_secret: string }
  | { ok: false; message: string };

export async function createSetupIntent(): Promise<SetupIntentResult> {
  try {
    const result = await apiFetch<{ customer_id: string; client_secret: string }>(
      "/api/v1/donations/setup-intent",
      { method: "POST" }
    );
    return { ok: true, ...result };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof ApiError ? error.message : "Something went wrong.",
    };
  }
}

export type ConfirmBasketResult = { ok: true; legs: LegResult[] } | { ok: false; message: string };

export async function confirmBasketCheckout(
  input: ConfirmBasketInput
): Promise<ConfirmBasketResult> {
  try {
    const result = await apiFetch<{ legs: LegResult[] }>("/api/v1/donations/confirm", {
      method: "POST",
      body: input,
    });
    return { ok: true, legs: result.legs };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof ApiError ? error.message : "Something went wrong.",
    };
  }
}
