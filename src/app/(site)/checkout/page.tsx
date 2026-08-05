"use client";

import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useBasket } from "@/components/site/basket-context";
import { CheckoutForm, StripeCheckoutForm } from "@/components/site/checkout-form";
import { useCurrency } from "@/components/site/currency-context";
import { computeBasketTotals } from "@/lib/basket-totals";
import { createSetupIntent } from "@/lib/donation-actions";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe-client";
import { resolveImageUrl } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, coverFee } = useBasket();
  const { currency, format } = useCurrency();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [setupIntent, setSetupIntent] = useState<{
    customerId: string;
    clientSecret: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) {
      router.replace("/donate");
      return;
    }
    let cancelled = false;
    createSetupIntent().then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setSetupIntent({ customerId: result.customer_id, clientSecret: result.client_secret });
      } else {
        setError(result.message);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mounted, items.length, router]);

  if (!mounted) {
    return (
      <section className="pt-section">
        <div className="pt-container" style={{ maxWidth: 1100 }}>
          <h1 className="pt-section-title" style={{ marginBottom: 40 }}>
            Checkout
          </h1>
          <p style={{ color: "var(--pt-text-muted)" }}>Loading secure checkout…</p>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const { subtotalCents, feeCents, totalCents } = computeBasketTotals(items, coverFee);

  return (
    <section className="pt-section">
      <div className="pt-container" style={{ maxWidth: 1100 }}>
        <h1 className="pt-section-title" style={{ marginBottom: 40 }}>
          Checkout
        </h1>

        <div className="pt-grid" style={{ gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
          <div>
            {error && (
              <p style={{ color: "var(--pt-danger)", marginBottom: 16 }}>{error}</p>
            )}
            {setupIntent ? (
              <Elements
                stripe={getStripe()}
                options={{ clientSecret: setupIntent.clientSecret, appearance: { theme: "stripe" } }}
              >
                <StripeCheckoutForm
                  customerId={setupIntent.customerId}
                  items={items}
                  coverFee={coverFee}
                  totalCents={totalCents}
                />
              </Elements>
            ) : !error ? (
              <p style={{ color: "var(--pt-text-muted)" }}>Loading secure checkout…</p>
            ) : null}
          </div>

          <div className="pt-order-summary">
            <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
            {items.map((item) => {
              const imgSrc = resolveImageUrl(item.campaignImage);
              return (
                <div key={item.key} className="pt-order-summary-row" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {imgSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={imgSrc}
                      alt={item.campaignTitle}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        objectFit: "cover",
                        flexShrink: 0,
                        background: "var(--pt-bg)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        flexShrink: 0,
                        background: "var(--pt-primary-alpha)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--pt-primary)",
                      }}
                    >
                      <i className="fa-solid fa-hand-holding-heart" />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--pt-text)" }}>
                      {item.campaignTitle}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--pt-text-muted)" }}>
                      {item.frequency === "monthly" ? "Monthly" : "One-time"} × {item.quantity}
                    </div>
                  </div>
                  <strong style={{ whiteSpace: "nowrap" }}>{format(item.unitAmountCents * item.quantity)}</strong>
                </div>
              );
            })}
            <div className="pt-order-summary-row" style={{ border: "none" }}>
              <span>Subtotal</span>
              <span>{format(subtotalCents)}</span>
            </div>
            {feeCents > 0 && (
              <div className="pt-order-summary-row" style={{ border: "none" }}>
                <span>Card processing fee</span>
                <span>{format(feeCents)}</span>
              </div>
            )}
            <div className="pt-order-summary-total">
              <span>Total</span>
              <span>{format(totalCents)}</span>
            </div>
            {currency !== "USD" && (
              <p style={{ fontSize: "0.75rem", color: "var(--pt-text-light)", marginTop: 8 }}>
                Amounts shown in {currency}. Your card will be charged the USD equivalent.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
