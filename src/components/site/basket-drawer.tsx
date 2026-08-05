"use client";

import { useRouter } from "next/navigation";

import { useBasket } from "@/components/site/basket-context";
import { useCurrency } from "@/components/site/currency-context";
import { useToast } from "@/components/site/toast-provider";
import { computeBasketTotals } from "@/lib/basket-totals";

const FEE_FIXED_CENTS = 30;

export function BasketDrawer() {
  const { items, isOpen, coverFee, setCoverFee, removeItem, setQuantity, closeBasket } =
    useBasket();
  const { currency, format } = useCurrency();
  const showToast = useToast();
  const router = useRouter();

  const { feeCents, totalCents } = computeBasketTotals(items, coverFee);

  return (
    <>
      <div
        className={`pt-drawer-overlay${isOpen ? " pt-drawer-open" : ""}`}
        onClick={closeBasket}
        aria-hidden="true"
      />
      <aside className={`pt-drawer${isOpen ? " pt-drawer-open" : ""}`} aria-label="Your basket">
        <div className="pt-drawer-header">
          <h3 style={{ margin: 0 }}>
            <i className="fa-solid fa-cart-shopping" style={{ marginRight: 8 }} />
            Your Basket {items.length > 0 && `· ${items.length} item${items.length > 1 ? "s" : ""}`}
          </h3>
          <button type="button" className="pt-drawer-close" onClick={closeBasket} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="pt-drawer-body">
          {items.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--pt-text-muted)", marginTop: 40 }}>
              Your basket is empty. Add a donation from any campaign to get started.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.key} className="pt-basket-item">
                {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary/dynamic storage host */}
                <img
                  src={item.campaignImage ?? undefined}
                  alt=""
                  className="pt-basket-item-img"
                  style={{ visibility: item.campaignImage ? "visible" : "hidden" }}
                />
                <div className="pt-basket-item-info">
                  <div className="pt-basket-item-title">{item.campaignTitle}</div>
                  <div className="pt-basket-item-sub">
                    {format(item.unitAmountCents)}
                    {item.frequency === "monthly" ? "/mo" : ""} · {item.frequency === "monthly" ? "Monthly" : "One-time"}
                  </div>
                  <div className="pt-basket-item-row">
                    <div className="pt-qty-stepper">
                      <button
                        type="button"
                        className="pt-qty-btn"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <i className="fa-solid fa-minus" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="pt-qty-btn"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <i className="fa-solid fa-plus" />
                      </button>
                    </div>
                    <strong>{format(item.unitAmountCents * item.quantity)}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="pt-basket-item-remove"
                  onClick={() => {
                    removeItem(item.key);
                    showToast("Removed", `${item.campaignTitle} removed from your basket.`, "info");
                  }}
                  aria-label="Remove"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-drawer-footer">
            <label className="pt-basket-fee-row">
              <input
                type="checkbox"
                checked={coverFee}
                onChange={(e) => setCoverFee(e.target.checked)}
                style={{ marginTop: 3 }}
              />
              <span>
                Cover the card processing fee ({format(feeCents || FEE_FIXED_CENTS)}) so
                100% of my donation reaches those in need
              </span>
            </label>

            <div className="pt-basket-total-row">
              <span>Total</span>
              <span>{format(totalCents)}</span>
            </div>

            {currency !== "USD" && (
              <p style={{ fontSize: "0.75rem", color: "var(--pt-text-light)", marginTop: -8, marginBottom: 12 }}>
                Amounts shown in {currency}. Your card will be charged the USD equivalent.
              </p>
            )}

            <button
              type="button"
              className="pt-btn pt-btn-primary pt-btn-pill pt-btn-full"
              onClick={() => {
                closeBasket();
                router.push("/checkout");
              }}
            >
              <i className="fa-solid fa-lock" /> Proceed to Checkout — {format(totalCents)}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
