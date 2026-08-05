import { ContactForm } from "@/components/site/contact-form";
import { FaqAccordion } from "@/components/site/faq-accordion";

export const metadata = { title: "Contact | AICT Global Bangladesh" };

export default function ContactPage() {
  return (
    <section className="pt-section">
      <div className="pt-container">
        <h1 className="pt-section-title">Get in Touch</h1>
        <p className="pt-section-subtitle">
          Have questions about our campaigns, events, or tax certificates? Contact our support
          staff, chat with us on WhatsApp using the button in the corner, or read our FAQ guide.
        </p>

        <div className="pt-grid pt-grid-2" style={{ gap: 50, alignItems: "flex-start", marginBottom: 60 }}>
          <div>
            <h2 style={{ fontSize: "1.75rem", marginBottom: 24 }}>Office Location</h2>
            <div
              style={{
                background: "var(--pt-card-bg)",
                border: "1px solid var(--pt-border)",
                borderRadius: "var(--pt-radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--pt-shadow-sm)",
                marginBottom: 30,
              }}
            >
              <div
                style={{
                  height: 250,
                  backgroundColor: "#cbd5e1",
                  backgroundImage:
                    "radial-gradient(var(--pt-border) 15%, transparent 16%), radial-gradient(var(--pt-border) 15%, transparent 16%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 10px 10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <i className="fa-solid fa-map-location-dot" style={{ fontSize: "4rem", color: "var(--pt-primary-alpha)", marginBottom: 10 }} />
                <div
                  style={{
                    background: "var(--pt-card-bg)",
                    padding: "8px 16px",
                    borderRadius: "var(--pt-radius-full)",
                    border: "1px solid var(--pt-border)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "var(--pt-shadow-md)",
                  }}
                >
                  <i className="fa-solid fa-location-pin" style={{ color: "var(--pt-danger)" }} />
                  120 Pine Street, SF
                </div>
              </div>
              <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <h4 style={{ marginBottom: 6 }}>
                    <i className="fa-solid fa-phone" style={{ color: "var(--pt-accent)", marginRight: 6 }} /> Call Us
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--pt-text-muted)" }}>
                    +880 1841-180037<br />Mon-Fri, 9AM - 5PM
                  </p>
                </div>
                <div>
                  <h4 style={{ marginBottom: 6 }}>
                    <i className="fa-solid fa-envelope" style={{ color: "var(--pt-accent)", marginRight: 6 }} /> Email Us
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--pt-text-muted)" }}>
                    connect@aictglobal.org<br />Average reply: 24 hours
                    <br />
                    <span style={{ fontSize: "0.8rem" }}>Organization: aictglobalbd@gmail.com</span>
                  </p>
                </div>
              </div>
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
            <h2 style={{ fontSize: "1.75rem", marginBottom: 12 }}>Send an Inquiry</h2>
            <p style={{ color: "var(--pt-text-muted)", fontSize: "0.9rem", marginBottom: 24 }}>
              Send us a message using the form below. We will get back to you as soon as
              possible.
            </p>
            <ContactForm />
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 className="pt-section-title">Frequently Asked Questions</h2>
          <p className="pt-section-subtitle">
            Find quick answers to common questions about donation tax benefits, community
            registration, and fund delivery models.
          </p>
          <div style={{ marginTop: 30 }}>
            <FaqAccordion />
          </div>
        </div>
      </div>
    </section>
  );
}
