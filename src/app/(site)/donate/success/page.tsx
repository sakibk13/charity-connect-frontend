import Link from "next/link";

import { getCampaigns, getDonationsByIds } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Thank You | AICT Global Bangladesh" };

function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string; issue?: string }>;
}) {
  const { ids, issue } = await searchParams;
  const [donations, campaigns] = await Promise.all([
    getDonationsByIds(ids ? ids.split(",") : []),
    getCampaigns(),
  ]);
  const campaignTitle = (id: string | null) =>
    campaigns.find((c) => c.id === id)?.title ?? "General fund";

  return (
    <section className="pt-section">
      <div className="pt-container" style={{ maxWidth: 640, textAlign: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--pt-primary-alpha)",
            color: "var(--pt-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 20px",
          }}
        >
          <i className="fa-solid fa-check" />
        </div>

        <h1 style={{ marginBottom: 12 }}>Thank You for Your Donation</h1>
        <p style={{ color: "var(--pt-text-muted)", marginBottom: 32 }}>
          Your generosity is making a real difference. A confirmation has been sent to your email.
        </p>

        {issue && (
          <p
            style={{
              color: "var(--pt-warning)",
              background: "var(--pt-border-light)",
              borderRadius: "var(--pt-radius-md)",
              padding: 12,
              marginBottom: 24,
              fontSize: "0.9rem",
            }}
          >
            One part of your donation didn&rsquo;t go through: {issue}
          </p>
        )}

        {donations && donations.length > 0 && (
          <div
            style={{
              textAlign: "left",
              background: "var(--pt-card-bg)",
              border: "1px solid var(--pt-border)",
              borderRadius: "var(--pt-radius-lg)",
              padding: 20,
              marginBottom: 24,
            }}
          >
            {donations
              .filter((d) => !d.is_fee)
              .map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--pt-border)",
                  }}
                >
                  <span>
                    {campaignTitle(d.campaign_id)}{" "}
                    <span style={{ color: "var(--pt-text-muted)", fontSize: "0.85rem" }}>
                      ({d.frequency === "monthly" ? "Monthly" : "One-time"})
                    </span>
                  </span>
                  <strong>{formatDollars(d.amount_cents)}</strong>
                </div>
              ))}
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <Link href="/" className="pt-btn pt-btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
