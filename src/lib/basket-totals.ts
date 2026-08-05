import type { BasketItem } from "@/lib/basket-store";

const FEE_PERCENT = 0.029;
const FEE_FIXED_CENTS = 30;

export function computeBasketTotals(items: BasketItem[], coverFee: boolean) {
  const subtotalCents = items.reduce((sum, i) => sum + i.unitAmountCents * i.quantity, 0);
  const feeCents = coverFee ? Math.round(subtotalCents * FEE_PERCENT) + FEE_FIXED_CENTS : 0;
  return { subtotalCents, feeCents, totalCents: subtotalCents + feeCents };
}
