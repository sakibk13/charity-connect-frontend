"use client";

import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useBasket } from "@/components/site/basket-context";
import { CheckoutForm } from "@/components/site/checkout-form";
import { useCurrency } from "@/components/site/currency-context";
import { computeBasketTotals } from "@/lib/basket-totals";
import { createSetupIntent } from "@/lib/donation-actions";
import { getStripe } from "@/lib/stripe-client";

export default function CheckoutPage() {
  const { items, coverFee } = useBasket();
  const { currency, format } = useCurrency();
  const router = useRouter();
  const [setupIntent, setSetupIntent] = useState<{
    customerId: string;
    clientSecret: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
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
    // Only ever needs to run once per page visit — re-running on every basket change
    // would recreate the SetupIntent mid-fill.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <CheckoutForm
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
            {items.map((item) => (
              <div key={item.key} className="pt-order-summary-row">
                <span>
                  {item.campaignTitle}
                  <br />
                  <span className="pt-order-summary-row-sub">
                    {item.frequency === "monthly" ? "Monthly" : "One-time"} × {item.quantity}
                  </span>
                </span>
                <strong>{format(item.unitAmountCents * item.quantity)}</strong>
              </div>
            ))}
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
