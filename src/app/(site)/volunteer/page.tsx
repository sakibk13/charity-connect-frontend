import { VolunteerForm } from "@/components/site/volunteer-form";
import { getCampaigns } from "@/lib/data";

export const metadata = { title: "Volunteer | AICT Global Bangladesh" };
export const dynamic = "force-dynamic";

const POSITIONS = [
  {
    title: "Community Outreach Organizer",
    time: "Part-time (5 hours/week)",
    desc: "Help organize food distributions, verify regional delivery points, and manage local volunteers on site.",
  },
  {
    title: "Digital Advocacy Advocate",
    time: "Remote (Flexible)",
    desc: "Share updates, write success stories, edit photos, and help moderate our digital communication platforms.",
  },
  {
    title: "Logistics Specialist",
    time: "On-call / Weekend Operations",
    desc: "Assist in sorting donations, packing emergency disaster response containers, and coordinating truck transfers.",
  },
];

export default async function VolunteerPage() {
  const campaigns = await getCampaigns();

  return (
    <section className="pt-section">
      <div className="pt-container">
        <h1 className="pt-section-title">Volunteer Registry</h1>
        <p className="pt-section-subtitle">
          Be the change in the field. Join our force of passionate volunteers and work directly
          on our projects.
        </p>

        <div className="pt-grid pt-grid-2" style={{ gap: 50, alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: "1.75rem", marginBottom: 24 }}>Current Opportunities</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {POSITIONS.map((pos) => (
                <div
                  key={pos.title}
                  style={{
                    background: "var(--pt-card-bg)",
                    border: "1px solid var(--pt-border)",
                    borderRadius: "var(--pt-radius-md)",
                    padding: 20,
                    boxShadow: "var(--pt-shadow-sm)",
                  }}
                >
                  <span className="pt-card-badge" style={{ position: "static", display: "inline-block", fontSize: "0.7rem", marginBottom: 8 }}>
                    {pos.time}
                  </span>
                  <h3 style={{ fontSize: "1.15rem", marginBottom: 8 }}>{pos.title}</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--pt-text-muted)", lineHeight: 1.4 }}>{pos.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "var(--pt-card-bg)",
              border: "1px solid var(--pt-border)",
              borderRadius: "var(--pt-radius-lg)",
              padding: 30,
              boxShadow: "var(--pt-shadow-md)",
            }}
          >
            <h2 style={{ fontSize: "1.75rem", marginBottom: 12 }}>Volunteer Online</h2>
            <p style={{ color: "var(--pt-text-muted)", fontSize: "0.9rem", marginBottom: 24 }}>
              Fill in your details below, and our community moderators will schedule a quick
              introductory interview with you.
            </p>
            <VolunteerForm campaigns={campaigns} />
          </div>
        </div>
      </div>
    </section>
  );
}
