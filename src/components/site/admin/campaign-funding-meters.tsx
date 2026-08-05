import type { Campaign } from "@/lib/types";

/**
 * Each campaign's raised-vs-goal is "a single ratio against a limit" — the
 * dataviz skill's form table calls that a Meter, not a bar-chart comparison.
 * One accent hue (fill) + a lighter step of the same ramp (track), sorted by
 * % funded so the reader sees who's closest to goal first. No legend needed:
 * a single series names itself via the section title.
 */
export function CampaignFundingMeters({ campaigns }: { campaigns: Campaign[] }) {
  const rows = campaigns
    .map((c) => ({
      ...c,
      pct: c.goal > 0 ? Math.min(100, (c.raised / c.goal) * 100) : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="space-y-3">
      {rows.map((c) => (
        <div key={c.id} title={`$${c.raised.toLocaleString()} raised of $${c.goal.toLocaleString()} goal`}>
          <div className="mb-1 flex items-baseline justify-between gap-4 text-sm">
            <span className="truncate font-medium">{c.title}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {Math.round(c.pct)}%
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--meter-track)" }}
            role="progressbar"
            aria-valuenow={Math.round(c.pct)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full transition-[width]"
              style={{ width: `${c.pct}%`, backgroundColor: "var(--meter-fill)" }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            ${c.raised.toLocaleString()} raised of ${c.goal.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
