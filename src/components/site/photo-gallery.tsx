"use client";

import { useState } from "react";

import type { GalleryPhoto } from "@/lib/types";

export const GALLERY_CATEGORIES = [
  "Water Aid",
  "Education",
  "Medical Aid",
  "Food Aid",
  "Housing",
  "Emergency",
];

export function PhotoGallery({ photos: allPhotos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<string | null>(null);
  const photos = active ? allPhotos.filter((p) => p.category === active) : allPhotos;

  if (allPhotos.length === 0) return null;

  // Tabs reflect whichever categories actually have photos right now — new
  // categories created in the admin panel show up here automatically.
  const categories = Array.from(new Set(allPhotos.map((p) => p.category))).sort();

  return (
    <section className="pt-section" style={{ background: "var(--pt-border-light)" }}>
      <div className="pt-container">
        <h2 className="pt-section-title">
          See Your Donations
          <span style={{ display: "block", color: "var(--pt-accent)" }}>Making a Difference</span>
        </h2>
        <p className="pt-section-subtitle">
          Real moments from our fieldwork across the world. Filter by initiative to see specific
          projects.
        </p>

        <div className="pt-tabs" style={{ justifyContent: "center", marginBottom: 40 }}>
          <button
            type="button"
            className={`pt-tab-btn${active === null ? " active" : ""}`}
            onClick={() => setActive(null)}
          >
            All Initiatives
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`pt-tab-btn${active === c ? " active" : ""}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {photos.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--pt-text-muted)" }}>
            No photos for this initiative yet.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gridAutoRows: 150,
              gridAutoFlow: "dense",
              gap: 16,
            }}
          >
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                style={{
                  position: "relative",
                  borderRadius: "var(--pt-radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--pt-shadow-md)",
                  gridRow: i % 5 === 0 ? "span 2" : undefined,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary/dynamic storage host */}
                <img
                  src={photo.image_key}
                  alt={photo.alt_text ?? ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
