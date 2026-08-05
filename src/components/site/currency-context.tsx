"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { CURRENCIES, formatCurrency, type CurrencyCode } from "@/lib/currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  format: (usdCents: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "charity_connect_currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("BDT");

  useEffect(() => {
    // State has to start as BDT on both server and client to avoid a
    // hydration mismatch, so picking up a saved currency can only happen
    // here, after mount, rather than via a lazy initial state.
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored && stored in CURRENCIES) setCurrencyState(stored as CurrencyCode);
  }, []);

  const setCurrency = (next: CurrencyCode) => {
    setCurrencyState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      format: (usdCents: number) => formatCurrency(usdCents, currency),
    }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within <CurrencyProvider>");
  return ctx;
}
