"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CampaignCard } from "@/components/site/campaign-card";
import type { Campaign } from "@/lib/types";

const EDGE_TOLERANCE_PX = 4;
const AUTOPLAY_MS = 4500;

export function CampaignCarousel({ campaigns }: { campaigns: Campaign[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateEdges = () => {
      setAtStart(track.scrollLeft <= EDGE_TOLERANCE_PX);
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - EDGE_TOLERANCE_PX);
    };

    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      track.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [campaigns.length]);

  const scrollByOneCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector<HTMLElement>(".pt-carousel-item");
    const gap = 24;
    const step = item ? item.getBoundingClientRect().width + gap : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  // Auto-advance right-to-left like the hero slider, but pause while the
  // visitor's pointer is over the carousel so autoplay doesn't fight a
  // manual click or a mid-scroll swipe. Loops back to the start at the end
  // instead of stalling there.
  useEffect(() => {
    if (campaigns.length <= 1 || paused) return;
    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const nearEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - EDGE_TOLERANCE_PX;
      if (nearEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByOneCard(1);
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [campaigns.length, paused, scrollByOneCard]);

  if (campaigns.length === 0) return null;

  return (
    <div
      className="pt-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pt-carousel-track" ref={trackRef}>
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="pt-carousel-item">
            <CampaignCard campaign={campaign} />
          </div>
        ))}
      </div>

      {campaigns.length > 1 && (
        <div className="pt-carousel-controls">
          <button
            type="button"
            aria-label="Previous campaign"
            className="pt-carousel-arrow"
            disabled={atStart}
            onClick={() => scrollByOneCard(-1)}
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button
            type="button"
            aria-label="Next campaign"
            className="pt-carousel-arrow pt-carousel-arrow-primary"
            disabled={atEnd}
            onClick={() => scrollByOneCard(1)}
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}
    </div>
  );
}
