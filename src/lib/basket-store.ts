import type { DonationFrequency } from "@/lib/types";

export interface BasketItem {
  key: string;
  campaignId: string;
  campaignTitle: string;
  campaignImage: string | null;
  unitAmountCents: number;
  quantity: number;
  frequency: DonationFrequency;
}

const STORAGE_KEY = "cc_basket";

let items: BasketItem[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function makeKey(campaignId: string, frequency: DonationFrequency, unitAmountCents: number) {
  return `${campaignId}:${frequency}:${unitAmountCents}`;
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function emit() {
  listeners.forEach((listener) => listener());
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) items = JSON.parse(raw);
  } catch {
    // ignore malformed/unavailable storage
  }
}

export const basketStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): BasketItem[] {
    ensureLoaded();
    return items;
  },
  getServerSnapshot(): BasketItem[] {
    return items;
  },
  addItem(item: Omit<BasketItem, "key" | "quantity">) {
    const key = makeKey(item.campaignId, item.frequency, item.unitAmountCents);
    const existing = items.find((i) => i.key === key);
    items = existing
      ? items.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i))
      : [...items, { ...item, key, quantity: 1 }];
    persist();
    emit();
  },
  removeItem(key: string) {
    items = items.filter((i) => i.key !== key);
    persist();
    emit();
  },
  setQuantity(key: string, quantity: number) {
    items = quantity <= 0 ? items.filter((i) => i.key !== key) : items.map((i) => (i.key === key ? { ...i, quantity } : i));
    persist();
    emit();
  },
  clear() {
    items = [];
    persist();
    emit();
  },
};
