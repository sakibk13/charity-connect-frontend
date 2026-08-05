"use client";

import Image from "next/image";
import Link from "next/link";

import { useToast } from "@/components/site/toast-provider";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/campaigns", label: "Appeals" },
  { href: "/events", label: "Community Events" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
];

const GET_INVOLVED_LINKS = [
  { href: "/volunteer", label: "Volunteer With Us" },
  { href: "/zakat", label: "Zakat Calculator" },
  { href: "/donate", label: "Donate Now" },
];

const PAYMENT_ICONS = ["fa-cc-visa", "fa-cc-mastercard", "fa-cc-amex", "fa-cc-paypal"];

export function SiteFooter() {
  const showToast = useToast();

  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("email") as HTMLInputElement;
    const email = input.value.trim();
    if (!email) return;
    showToast(
      "Subscription Success",
      `Thank you! ${email} has been subscribed to our newsletter list.`,
      "success"
    );
    form.reset();
  };

  return (
    <footer className="pt-footer">
      <div className="pt-footer-main">
        <div className="pt-container pt-footer-grid">
          <div>
            <Link href="/" style={{ display: "inline-block", marginBottom: 12 }}>
              <Image
                src="/logo-white.png"
                alt="AICT Global Bangladesh logo"
                width={112}
                height={112}
              />
            </Link>
            <p style={{ marginBottom: 10, fontSize: "0.85rem", lineHeight: 1.5 }}>
              AICT Global Bangladesh delivers emergency relief, sustainable development, and
              community empowerment across Bangladesh.
            </p>
            <div className="pt-social-links">
              <a href="https://www.facebook.com/aictglobal/" target="_blank" rel="noopener noreferrer" className="pt-social-btn" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a href="https://x.com/aictglobal" target="_blank" rel="noopener noreferrer" className="pt-social-btn" aria-label="Twitter">
                <i className="fa-brands fa-x-twitter" />
              </a>
              <a href="https://www.instagram.com/aictglobal/" target="_blank" rel="noopener noreferrer" className="pt-social-btn" aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="https://www.youtube.com/@aictglobal2885" target="_blank" rel="noopener noreferrer" className="pt-social-btn" aria-label="YouTube">
                <i className="fa-brands fa-youtube" />
              </a>
            </div>
          </div>

          <div className="pt-footer-col">
            <h3>Quick Links</h3>
            <ul className="pt-footer-links-dot">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-footer-col">
            <h3>Get Involved</h3>
            <ul className="pt-footer-links-dot">
              {GET_INVOLVED_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-footer-col">
            <h3>Get In Touch</h3>
            <ul className="pt-footer-contact">
              <li>
                <i className="fa-solid fa-location-dot" />
                <span>House/Road TBD, Dhanmondi<br />Dhaka 1209, Bangladesh</span>
              </li>
              <li>
                <i className="fa-solid fa-phone" />
                <a href="tel:+8801841180037">+880 1841-180037</a>
              </li>
              <li>
                <i className="fa-solid fa-envelope" />
                <a href="mailto:connect@aictglobal.org">connect@aictglobal.org</a>
              </li>
            </ul>
          </div>

          <div className="pt-footer-col">
            <h3>Stay Connected</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--pt-footer-text-muted)" }}>
              Get inspiring stories and impact updates delivered to your inbox.
            </p>
            <form className="pt-newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                required
                className="pt-newsletter-input"
                aria-label="Email address"
              />
              <button type="submit" className="pt-newsletter-submit">
                Subscribe <i className="fa-solid fa-arrow-right" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="pt-footer-subbar">
        <div className="pt-container">
          <p className="pt-footer-credit">Made by NexaForce Solutions</p>
          <div className="pt-footer-payments">
            {PAYMENT_ICONS.map((icon) => (
              <i key={icon} className={`fa-brands ${icon}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-footer-bottom">
        <div className="pt-container">
          <p>&copy; {new Date().getFullYear()} AICT Global Bangladesh. All rights reserved.</p>
          <div className="pt-footer-legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
