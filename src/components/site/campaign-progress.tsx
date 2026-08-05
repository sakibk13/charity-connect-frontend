"use client";

import { useCurrency } from "@/components/site/currency-context";

export function CampaignProgress({
  raised,
  goal,
  goalMarginBottom = 0,
}: {
  raised: number;
  goal: number;
  goalMarginBottom?: number;
}) {
  const { format } = useCurrency();
  const pct = Math.min(100, Math.round((raised / goal) * 100));

  return (
    <>
      <div className="pt-progress-labels">
        <span>Raised: {format(Math.round(raised * 100))}</span>
        <span>{pct}%</span>
      </div>
      <div className="pt-progress-bar-bg">
        <div className="pt-progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div
        className="pt-progress-labels"
        style={{
          marginTop: 6,
          marginBottom: goalMarginBottom,
          fontWeight: 500,
          fontSize: "0.8rem",
          color: "var(--pt-text-light)",
        }}
      >
        <span>Goal: {format(Math.round(goal * 100))}</span>
      </div>
    </>
  );
}
