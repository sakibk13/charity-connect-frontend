import { CampaignCard } from "@/components/site/campaign-card";
import { getCampaigns } from "@/lib/data";

export const metadata = { title: "Campaigns | AICT Global Bangladesh" };

const CATEGORIES = ["Environment", "Education", "Humanitarian"];

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;
  const campaigns = await getCampaigns({ search, category });

  return (
    <section className="pt-section">
      <div className="pt-container">
        <h1 className="pt-section-title">Fundraising Campaigns</h1>
        <p className="pt-section-subtitle">
          Support specific global projects or emergency relief funds. Your gifts help communities
          establish resilience.
        </p>

        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 40,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            background: "var(--pt-card-bg)",
            border: "1px solid var(--pt-border)",
            padding: "16px 24px",
            borderRadius: "var(--pt-radius-md)",
          }}
        >
          <form method="get" className="pt-tabs">
            <button type="submit" name="category" value="" className={`pt-tab-btn${!category ? " active" : ""}`}>
              All Causes
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="submit"
                name="category"
                value={c}
                className={`pt-tab-btn${category === c ? " active" : ""}`}
              >
                {c}
              </button>
            ))}
          </form>

          <form method="get" style={{ position: "relative", width: "100%", maxWidth: 320 }}>
            {category && <input type="hidden" name="category" value={category} />}
            <input
              type="text"
              name="search"
              defaultValue={search}
              className="pt-form-input"
              placeholder="Search campaigns..."
              style={{ paddingLeft: 40, paddingRight: 16, marginBottom: 0 }}
            />
            <i
              className="fa-solid fa-magnifying-glass"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--pt-text-light)" }}
            />
          </form>
        </div>

        {campaigns.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: "3rem", color: "var(--pt-text-light)", marginBottom: 16 }} />
            <h3>No Campaigns Found</h3>
            <p style={{ color: "var(--pt-text-muted)", marginTop: 8 }}>
              Try searching for a different keyword or checking other categories.
            </p>
          </div>
        ) : (
          <div className="pt-grid pt-grid-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
