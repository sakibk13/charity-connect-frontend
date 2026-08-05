"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 300;

export function FloatingDonateButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link
      href="/donate"
      aria-label="Donate now"
      className={`pt-floating-donate fixed bottom-5 left-1/2 z-50 flex h-10 -translate-x-1/2 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        background: "linear-gradient(135deg, var(--pt-accent) 0%, var(--pt-accent-hover) 100%)",
        boxShadow: "var(--pt-shadow-accent)",
      }}
    >
      <i className="fa-solid fa-hand-holding-heart" aria-hidden="true" />
      Donate Now
    </Link>
  );
}
