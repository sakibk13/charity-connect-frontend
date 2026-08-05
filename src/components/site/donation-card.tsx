"use client";

import { useState } from "react";

import { useBasket } from "@/components/site/basket-context";
import { useCurrency } from "@/components/site/currency-context";
import { CURRENCIES } from "@/lib/currency";
import type { Campaign, DonationFrequency } from "@/lib/types";

export const DONATION_PRESETS: Record<DonationFrequency, number[]> = {
  one_time: [2500, 5000, 10000, 25000],
  monthly: [500, 1000, 2500, 5000],
};

export function DonationCard({
  campaign,
  variant = "full",
}: {
  campaign: Campaign;
  variant?: "full" | "compact";
}) {
  const { addItem } = useBasket();
  const { currency, format } = useCurrency();
  const [frequency, setFrequency] = useState<DonationFrequency>("one_time");
  const [selected, setSelected] = useState<number>(DONATION_PRESETS.one_time[1]);
  const [customAmount, setCustomAmount] = useState("");

  const presets = DONATION_PRESETS[frequency];
  // Basket amounts are always stored as USD cents (that's what Stripe actually
  // charges), so a typed amount in a non-USD currency has to be converted back.
  const customCents = customAmount
    ? Math.round((parseFloat(customAmount) / CURRENCIES[currency].rateFromUsd) * 100)
    : 0;
  const activeCents = customCents > 0 ? customCents : selected;

  const switchFrequency = (next: DonationFrequency) => {
    setFrequency(next);
    setSelected(DONATION_PRESETS[next][1]);
    setCustomAmount("");
  };

  const handleAdd = () => {
    if (!activeCents || activeCents <= 0) return;
    addItem({
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      campaignImage: campaign.image_key,
      unitAmountCents: activeCents,
      frequency,
    });
  };

  const body = (
    <>
      {variant === "full" && <h3 className="pt-donate-card-title">{campaign.title}</h3>}

      <div className="pt-freq-toggle">
        <button
          type="button"
          className={`pt-freq-btn${frequency === "monthly" ? " active" : ""}`}
          onClick={() => switchFrequency("monthly")}
        >
          Monthly
        </button>
        <button
          type="button"
          className={`pt-freq-btn${frequency === "one_time" ? " active" : ""}`}
          onClick={() => switchFrequency("one_time")}
        >
          One-time
        </button>
      </div>

      <div className="pt-amount-grid">
        {presets.map((cents) => (
          <button
            key={cents}
            type="button"
            className={`pt-amount-btn${!customCents && selected === cents ? " active" : ""}`}
            onClick={() => {
              setSelected(cents);
              setCustomAmount("");
            }}
          >
            {format(cents)}
          </button>
        ))}
      </div>

      <div className="pt-donate-custom-wrap">
        <span className="pt-currency-prefix">{CURRENCIES[currency].symbol}</span>
        <input
          type="number"
          min={1}
          placeholder="Other amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="pt-btn pt-btn-primary pt-btn-pill pt-btn-full"
        disabled={!activeCents}
        onClick={handleAdd}
      >
        <i className="fa-solid fa-cart-plus" /> Add to Basket — {format(activeCents)}
        {frequency === "monthly" ? "/mo" : ""}
      </button>
    </>
  );

  if (variant === "compact") {
    return <div className="pt-donate-card-body" style={{ padding: 0 }}>{body}</div>;
  }

  return (
    <div className="pt-donate-card">
      <div className="pt-donate-card-img-wrapper">
        {campaign.image_key ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary/dynamic storage host
          <img src={campaign.image_key} alt={campaign.title} className="pt-donate-card-img" />
        ) : null}
        <span className="pt-card-badge">{campaign.category}</span>
      </div>
      <div className="pt-donate-card-body">{body}</div>
    </div>
  );
}
