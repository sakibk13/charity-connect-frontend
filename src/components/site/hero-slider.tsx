"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCurrency } from "@/components/site/currency-context";
import type { HeroSlide } from "@/lib/types";

const AUTOPLAY_MS = 6000;

export function HeroSlider({
  slides,
  totalRaisedCents,
  stats,
}: {
  slides: HeroSlide[];
  totalRaisedCents: number;
  stats: { value: string; label: string }[];
}) {
  const { format } = useCurrency();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const goTo = (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length);

  return (
    <section className="pt-hero-slider">
      {slides.map((slide, i) => (
        <div key={slide.id} className={`pt-hero-slide${i === index ? " active" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary/dynamic storage host */}
          <img src={slide.image_key} alt="" className="pt-hero-slide-img" />
          <div className="pt-hero-slide-overlay" />
          <div className="pt-container pt-hero-slide-content">
            <h1 className="pt-hero-slide-headline">{slide.headline}</h1>
            <span className="pt-hero-slide-badge">{slide.badge_text}</span>
            <div>
              <Link href={slide.cta_href} className="pt-btn pt-btn-accent pt-btn-lg pt-btn-pill">
                {slide.cta_label}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-hero-bottom-fade" />

      <div className="pt-container pt-hero-bottom">
        <div className="pt-hero-stats">
          <div className="pt-hero-stats-item">
            <div className="pt-hero-stats-value">{format(totalRaisedCents)}</div>
            <div className="pt-hero-stats-label">Total Funds Raised</div>
          </div>
          {stats.map((stat) => (
            <div key={stat.label} className="pt-hero-stats-item">
              <div className="pt-hero-stats-value">{stat.value}</div>
              <div className="pt-hero-stats-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <div className="pt-hero-slider-controls">
            <button
              type="button"
              aria-label="Previous slide"
              className="pt-hero-arrow"
              onClick={() => goTo(index - 1)}
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
            <div className="pt-hero-dots">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  className={`pt-hero-dot${i === index ? " active" : ""}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next slide"
              className="pt-hero-arrow"
              onClick={() => goTo(index + 1)}
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
