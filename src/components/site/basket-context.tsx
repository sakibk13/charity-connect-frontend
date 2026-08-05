"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";

import { basketStore, type BasketItem } from "@/lib/basket-store";

export type { BasketItem };

interface BasketContextValue {
  items: BasketItem[];
  isOpen: boolean;
  coverFee: boolean;
  addItem: (item: Omit<BasketItem, "key" | "quantity">) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  setCoverFee: (value: boolean) => void;
  clear: () => void;
  openBasket: () => void;
  closeBasket: () => void;
}

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    basketStore.subscribe,
    basketStore.getSnapshot,
    basketStore.getServerSnapshot
  );
  const [coverFee, setCoverFee] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<BasketContextValue>(
    () => ({
      items,
      isOpen,
      coverFee,
      addItem: (item) => {
        basketStore.addItem(item);
        setIsOpen(true);
      },
      removeItem: basketStore.removeItem,
      setQuantity: basketStore.setQuantity,
      setCoverFee,
      clear: () => {
        basketStore.clear();
        setCoverFee(false);
      },
      openBasket: () => setIsOpen(true),
      closeBasket: () => setIsOpen(false),
    }),
    [items, isOpen, coverFee]
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used within <BasketProvider>");
  return ctx;
}
