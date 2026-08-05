"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useBasket } from "@/components/site/basket-context";
import { useCurrency } from "@/components/site/currency-context";
import { confirmBasketCheckout } from "@/lib/donation-actions";
import type { BasketItem } from "@/lib/basket-store";

// Stripe requires a 2-letter ISO 3166-1 alpha-2 country code, not a free-text
// name — a plain text input here would fail on confirmSetup for any country
// name Stripe doesn't recognize verbatim.
const COUNTRIES = [
  ["US", "United States"],
  ["GB", "United Kingdom"],
  ["BD", "Bangladesh"],
  ["CA", "Canada"],
  ["AU", "Australia"],
  ["IN", "India"],
  ["PK", "Pakistan"],
  ["AE", "United Arab Emirates"],
  ["SA", "Saudi Arabia"],
  ["MY", "Malaysia"],
  ["SG", "Singapore"],
  ["DE", "Germany"],
  ["FR", "France"],
  ["NL", "Netherlands"],
  ["IE", "Ireland"],
  ["ZA", "South Africa"],
  ["NG", "Nigeria"],
  ["KE", "Kenya"],
  ["EG", "Egypt"],
  ["TR", "Turkey"],
] as const;

export function CheckoutForm({
  customerId,
  items,
  coverFee,
  totalCents,
}: {
  customerId: string;
  items: BasketItem[];
  coverFee: boolean;
  totalCents: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clear } = useBasket();
  const { currency, format } = useCurrency();

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [dedication, setDedication] = useState("");
  const [country, setCountry] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [postcode, setPostcode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!donorName.trim() || !donorEmail.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (!country.trim() || !addressLine1.trim() || !city.trim() || !postcode.trim()) {
      setError("Please fill in the required billing address fields.");
      return;
    }

    setSubmitting(true);

    let paymentMethodId = "pm_mock_card_local";

    if (stripe && elements) {
      const { error: elementsError } = await elements.submit();
      if (elementsError) {
        setError(elementsError.message ?? "Please check your card details.");
        setSubmitting(false);
        return;
      }

      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: donorName.trim(),
              email: donorEmail.trim(),
              phone: donorPhone.trim(),
              address: {
                country: country.trim(),
                line1: addressLine1.trim(),
                line2: addressLine2.trim(),
                city: city.trim(),
                state: county.trim(),
                postal_code: postcode.trim(),
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (setupError || !setupIntent || typeof setupIntent.payment_method !== "string") {
        setError(setupError?.message ?? "Could not verify the card. Please try again.");
        setSubmitting(false);
        return;
      }
      paymentMethodId = setupIntent.payment_method;
    }

    const result = await confirmBasketCheckout({
      customer_id: customerId || "cus_mock_local_dev",
      payment_method_id: paymentMethodId,
      items: items.map((i) => ({
        campaign_id: i.campaignId,
        amount_cents: i.unitAmountCents * i.quantity,
        frequency: i.frequency,
      })),
      cover_fee: coverFee,
      donor_name: donorName.trim(),
      donor_email: donorEmail.trim(),
      donor_phone: donorPhone.trim() || undefined,
      dedication: dedication.trim() || undefined,
      billing: {
        country: country.trim(),
        address_line1: addressLine1.trim(),
        address_line2: addressLine2.trim() || undefined,
        city: city.trim(),
        county: county.trim() || undefined,
        postcode: postcode.trim(),
      },
    });

    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    const succeededIds: string[] = [];
    let failureMessage = "";

    for (const leg of result.legs) {
      if (leg.status === "succeeded") {
        succeededIds.push(...leg.donation_ids);
        continue;
      }
      if (leg.status === "requires_action" && leg.client_secret) {
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          leg.client_secret
        );
        if (!confirmError && paymentIntent?.status === "succeeded") {
          succeededIds.push(...leg.donation_ids);
        } else {
          failureMessage = confirmError?.message ?? "A payment could not be completed.";
        }
        continue;
      }
      failureMessage = leg.message ?? "A payment could not be completed.";
    }

    setSubmitting(false);

    if (succeededIds.length === 0) {
      setError(failureMessage || "Payment could not be completed. Please try again.");
      return;
    }

    clear();
    const suffix = failureMessage ? `&issue=${encodeURIComponent(failureMessage)}` : "";
    router.push(`/donate/success?ids=${succeededIds.join(",")}${suffix}`);
  };

  return (
    <form onSubmit={handleSubmit} className="pt-checkout-form">
      <div className="pt-checkout-section">
        <h3 className="pt-checkout-section-title">
          <i className="fa-solid fa-user" /> Personal Details
        </h3>
        <div className="pt-form-group">
          <input
            type="text"
            className="pt-form-input"
            placeholder="Full name *"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            required
          />
        </div>
        <div className="pt-grid pt-grid-2" style={{ gap: 12 }}>
          <div className="pt-form-group" style={{ marginBottom: 0 }}>
            <input
              type="email"
              className="pt-form-input"
              placeholder="Email address *"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              required
            />
          </div>
          <div className="pt-form-group" style={{ marginBottom: 0 }}>
            <input
              type="tel"
              className="pt-form-input"
              placeholder="Phone number"
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="pt-checkout-section">
        <h3 className="pt-checkout-section-title">
          <i className="fa-solid fa-location-dot" /> Billing Address
        </h3>
        <div className="pt-form-group">
          <select
            className="pt-form-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="" disabled>
              Country *
            </option>
            {COUNTRIES.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="pt-form-group">
          <input
            type="text"
            className="pt-form-input"
            placeholder="Address line 1 *"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
          />
        </div>
        <div className="pt-form-group">
          <input
            type="text"
            className="pt-form-input"
            placeholder="Address line 2 (optional)"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />
        </div>
        <div className="pt-grid pt-grid-3" style={{ gap: 12 }}>
          <div className="pt-form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="pt-form-input"
              placeholder="City *"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="pt-form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="pt-form-input"
              placeholder="County"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            />
          </div>
          <div className="pt-form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="pt-form-input"
              placeholder="Postcode *"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-checkout-section">
        <h3 className="pt-checkout-section-title">
          <i className="fa-solid fa-note-sticky" /> Dedication
        </h3>
        <div className="pt-form-group" style={{ marginBottom: 0 }}>
          <input
            type="text"
            className="pt-form-input"
            placeholder="In memory of / on behalf of (optional)"
            value={dedication}
            onChange={(e) => setDedication(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-checkout-section">
        <h3 className="pt-checkout-section-title">
          <i className="fa-solid fa-credit-card" /> Payment Details
        </h3>
        {stripe && elements ? (
          <PaymentElement
            options={{
              fields: { billingDetails: "never" },
            }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="pt-form-group" style={{ marginBottom: 0 }}>
              <input
                type="text"
                className="pt-form-input"
                placeholder="Card number (e.g. 4242 4242 4242 4242)"
                defaultValue="4242 4242 4242 4242"
              />
            </div>
            <div className="pt-grid pt-grid-2" style={{ gap: 12 }}>
              <div className="pt-form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  className="pt-form-input"
                  placeholder="MM / YY"
                  defaultValue="12/28"
                />
              </div>
              <div className="pt-form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  className="pt-form-input"
                  placeholder="CVC"
                  defaultValue="123"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: "var(--pt-danger)", fontSize: "0.9rem", marginTop: 4 }}>{error}</p>
      )}

      <button
        type="submit"
        className="pt-btn pt-btn-primary pt-btn-pill pt-btn-full"
        disabled={submitting}
      >
        {submitting ? (
          "Processing…"
        ) : (
          <>
            <i className="fa-solid fa-lock" /> Donate {format(totalCents)}
          </>
        )}
      </button>
      <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--pt-text-light)" }}>
        <i className="fa-solid fa-lock" /> Your payment is secure and processed by Stripe.
        {currency !== "USD" && " Your card will be charged the USD equivalent."}
      </p>
    </form>
  );
}
