"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Where do my donations go?",
    a: "At AICT Global Bangladesh, 95% of all incoming donations go directly to project execution, including equipment purchases, local contractor payments, and community raw material supplies. The remaining 5% goes toward merchant transaction fees and basic maintenance of this platform. We publish full financial records quarterly.",
  },
  {
    q: "Will I get a receipt for my donation?",
    a: "Yes! Every donation you make generates a digital receipt automatically, which you can download from your Profile dashboard at any time for your own records.",
  },
  {
    q: "How can I set up monthly recurring giving?",
    a: "When you click 'Donate Now', select 'Monthly Recurring' under the Donation Type section. Your specified payment method will be charged automatically on the same day every month. You can cancel or modify this at any time in your Profile settings.",
  },
  {
    q: "How do I sign up as a volunteer?",
    a: "Head to our 'Volunteer' page, review our active positions, and fill in the registration form. Once submitted, our moderators will review your application. You will receive a status update within 2-3 business days.",
  },
  {
    q: "Can I sponsor a specific community campaign?",
    a: "Absolutely! Our donation flow allows you to choose exactly which active fundraising campaign you would like to support. You can track the progress of that specific campaign on our 'Campaigns' page.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {FAQS.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div
            key={faq.q}
            style={{
              border: "1px solid var(--pt-border)",
              borderRadius: "var(--pt-radius-md)",
              background: "var(--pt-card-bg)",
              marginBottom: 12,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "16px 20px",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--pt-text)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "inherit",
              }}
            >
              <span>{faq.q}</span>
              <i className={`fa-solid ${open ? "fa-minus" : "fa-plus"}`} style={{ color: "var(--pt-primary)" }} />
            </button>
            {open && (
              <div
                style={{
                  padding: "0 20px 20px 20px",
                  fontSize: "0.95rem",
                  color: "var(--pt-text-muted)",
                  lineHeight: 1.5,
                  borderTop: "1px solid var(--pt-border)",
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
