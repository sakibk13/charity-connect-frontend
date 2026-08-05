export type CurrencyCode =
  | "GBP"
  | "USD"
  | "EUR"
  | "CAD"
  | "AUD"
  | "INR"
  | "PKR"
  | "BDT"
  | "AED"
  | "SAR"
  | "MYR";

interface CurrencyDef {
  code: CurrencyCode;
  label: string;
  name: string;
  symbol: string;
  // Fixed conversion rate from 1 USD into this currency. Display-only,
  // approximate — the actual Stripe charge always happens in USD regardless
  // of the currency selected here.
  rateFromUsd: number;
  fractionDigits: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDef> = {
  GBP: { code: "GBP", label: "GBP (£)", name: "British Pound", symbol: "£", rateFromUsd: 0.79, fractionDigits: 2 },
  USD: { code: "USD", label: "USD ($)", name: "US Dollar", symbol: "$", rateFromUsd: 1, fractionDigits: 2 },
  EUR: { code: "EUR", label: "EUR (€)", name: "Euro", symbol: "€", rateFromUsd: 0.92, fractionDigits: 2 },
  CAD: { code: "CAD", label: "CAD (C$)", name: "Canadian Dollar", symbol: "C$", rateFromUsd: 1.36, fractionDigits: 2 },
  AUD: { code: "AUD", label: "AUD (A$)", name: "Australian Dollar", symbol: "A$", rateFromUsd: 1.52, fractionDigits: 2 },
  INR: { code: "INR", label: "INR (₹)", name: "Indian Rupee", symbol: "₹", rateFromUsd: 83, fractionDigits: 0 },
  PKR: { code: "PKR", label: "PKR (Rs)", name: "Pakistani Rupee", symbol: "Rs", rateFromUsd: 278, fractionDigits: 0 },
  BDT: { code: "BDT", label: "BDT (৳)", name: "Bangladeshi Taka", symbol: "৳", rateFromUsd: 122, fractionDigits: 0 },
  AED: { code: "AED", label: "AED (د.إ)", name: "UAE Dirham", symbol: "د.إ", rateFromUsd: 3.67, fractionDigits: 2 },
  SAR: { code: "SAR", label: "SAR (ر.س)", name: "Saudi Riyal", symbol: "ر.س", rateFromUsd: 3.75, fractionDigits: 2 },
  MYR: { code: "MYR", label: "MYR (RM)", name: "Malaysian Ringgit", symbol: "RM", rateFromUsd: 4.7, fractionDigits: 2 },
};

// Display order for the currency picker — matches the reference layout
// (GBP/USD/EUR first, BDT — this app's primary currency — mid-list).
export const CURRENCY_ORDER: CurrencyCode[] = [
  "GBP",
  "USD",
  "EUR",
  "CAD",
  "AUD",
  "INR",
  "PKR",
  "BDT",
  "AED",
  "SAR",
  "MYR",
];

export function formatCurrency(usdCents: number, currency: CurrencyCode): string {
  const def = CURRENCIES[currency];
  const amount = (usdCents / 100) * def.rateFromUsd;
  return `${def.symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: def.fractionDigits,
    maximumFractionDigits: def.fractionDigits,
  })}`;
}
