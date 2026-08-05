import { DonationCard } from "@/components/site/donation-card";
import { getCampaigns } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Donate Now | AICT Global Bangladesh" };

export default async function DonatePage() {
  const campaigns = await getCampaigns();

  return (
    <section className="pt-section">
      <div className="pt-container">
        <h1 className="pt-section-title">
          Donate Now
          <span style={{ display: "block", color: "var(--pt-accent)" }}>Choose a Cause</span>
        </h1>
        <p className="pt-section-subtitle">
          Your donation helps transform lives. Choose a campaign below, add it to your basket, and
          make a lasting difference today.
        </p>

        {campaigns.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--pt-text-muted)" }}>
            No active campaigns to donate to right now — check back soon.
          </p>
        ) : (
          <div className="pt-grid pt-grid-3">
            {campaigns.map((campaign) => (
              <DonationCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
