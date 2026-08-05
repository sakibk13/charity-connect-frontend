"use client";

import { useState } from "react";

import { DONATION_PRESETS } from "@/components/site/donation-card";
import { useBasket } from "@/components/site/basket-context";
import { useCurrency } from "@/components/site/currency-context";
import { CURRENCIES } from "@/lib/currency";
import type { Campaign, DonationFrequency } from "@/lib/types";

export const QUICK_DONATE_OPTIONS = [
  { id: "aqua-aid", title: "Aqua Aid" },
  { id: "sustain-now", title: "Sustain Now" },
  { id: "building-hope", title: "Building Hope" },
  { id: "bright-futures", title: "Bright Futures" },
  { id: "emergency-aid", title: "Emergency Aid" },
  { id: "share-meals", title: "Share Meals" },
  { id: "free-mobile-clinic", title: "Free Mobile Clinic" },
];

const DEFAULT_OPTION_IMAGES: Record<string, string> = {
  "aqua-aid": "/static/campaigns/aqua-aid.jpg",
  "sustain-now": "/static/campaigns/sustain-now.jpg",
  "building-hope": "/static/campaigns/building-hope.jpg",
  "bright-futures": "/static/campaigns/bright-futures.jpg",
  "emergency-aid": "/static/campaigns/emergency-aid.jpg",
  "share-meals": "/static/campaigns/share-meals.jpg",
  "free-mobile-clinic": "/static/campaigns/free-mobile-clinic.jpg",
};

export function QuickDonateBar({ campaigns }: { campaigns?: Campaign[] }) {
  const { addItem } = useBasket();
  const { currency, format } = useCurrency();
  const [frequency, setFrequency] = useState<DonationFrequency>("one_time");
  const [selectedOptionId, setSelectedOptionId] = useState(QUICK_DONATE_OPTIONS[0].id);
  const [selected, setSelected] = useState<number>(DONATION_PRESETS.one_time[0]);
  const [customAmount, setCustomAmount] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const presets = DONATION_PRESETS[frequency];
  const customCents = customAmount
    ? Math.round((parseFloat(customAmount) / CURRENCIES[currency].rateFromUsd) * 100)
    : 0;
  const activeCents = customCents > 0 ? customCents : selected;

  const currentOption =
    QUICK_DONATE_OPTIONS.find((o) => o.id === selectedOptionId) ?? QUICK_DONATE_OPTIONS[0];

  const switchFrequency = (next: DonationFrequency) => {
    setFrequency(next);
    setSelected(DONATION_PRESETS[next][0]);
    setCustomAmount("");
  };

  const handleAdd = () => {
    if (!activeCents || activeCents <= 0) return;
    const matchingCampaign = campaigns?.find(
      (c) =>
        c.title.toLowerCase().includes(currentOption.title.toLowerCase()) ||
        c.id === currentOption.id
    );

    const imageKey =
      matchingCampaign?.image_key ||
      DEFAULT_OPTION_IMAGES[currentOption.id] ||
      "/static/campaigns/food-relief.jpg";

    addItem({
      campaignId: matchingCampaign?.id ?? currentOption.id,
      campaignTitle: currentOption.title,
      campaignImage: imageKey,
      unitAmountCents: activeCents,
      frequency,
    });
  };

  return (
    <div className="pt-quickdonate-wrap">
      <div className="pt-container">
        <div className="pt-quickdonate-bar">
          <span className="pt-quickdonate-label">Quick Donate</span>

          <div className="pt-freq-toggle pt-quickdonate-freq">
            <button
              type="button"
              className={`pt-freq-btn${frequency === "one_time" ? " active" : ""}`}
              onClick={() => switchFrequency("one_time")}
            >
              One-Time
            </button>
            <button
              type="button"
              className={`pt-freq-btn${frequency === "monthly" ? " active" : ""}`}
              onClick={() => switchFrequency("monthly")}
            >
              Monthly
            </button>
          </div>

          <div className="pt-custom-select-wrap">
            <button
              type="button"
              className={`pt-quickdonate-select-trigger${isOpen ? " open" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Select appeal to support"
            >
              <span>{currentOption.title}</span>
              <i className={`fa-solid fa-chevron-down pt-select-arrow${isOpen ? " open" : ""}`} />
            </button>

            {isOpen && (
              <div className="pt-quickdonate-dropdown-menu">
                {QUICK_DONATE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`pt-dropdown-item${opt.id === selectedOptionId ? " selected" : ""}`}
                    onClick={() => {
                      setSelectedOptionId(opt.id);
                      setIsOpen(false);
                    }}
                  >
                    {opt.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-quickdonate-amounts">
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

          <div className="pt-donate-custom-wrap pt-quickdonate-custom">
            <span className="pt-currency-prefix">{CURRENCIES[currency].symbol}</span>
            <input
              type="number"
              min={1}
              placeholder="Other"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              aria-label="Custom donation amount"
            />
          </div>

          <button
            type="button"
            className="pt-btn pt-btn-accent pt-btn-pill pt-quickdonate-add"
            disabled={!activeCents}
            onClick={handleAdd}
          >
            <i className="fa-solid fa-cart-shopping" /> Add {format(activeCents)}
          </button>
        </div>
      </div>
    </div>
  );
}
