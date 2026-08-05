import { notFound } from "next/navigation";

import { EventRegisterForm } from "@/components/site/event-register-form";
import { getEvent } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { resolveImageUrl } from "@/lib/utils";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  return (
    <section className="pt-section">
      <div className="pt-container" style={{ maxWidth: 960 }}>
        <h1 style={{ fontSize: "2.5rem" }}>{event.title}</h1>

        <div
          style={{
            marginTop: 24,
            aspectRatio: "16/9",
            width: "100%",
            borderRadius: "var(--pt-radius-lg)",
            overflow: "hidden",
            backgroundColor: "var(--pt-border-light)",
          }}
        >
          {event.image_key ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveImageUrl(event.image_key)}
              alt={event.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>

        <div className="pt-grid" style={{ marginTop: 32, gridTemplateColumns: "1fr 320px", gap: 32 }}>
          <div>
            <div className="pt-event-meta" style={{ marginBottom: 16 }}>
              <span>
                <i className="fa-solid fa-calendar-days" />{" "}
                {formatDate(event.date, { month: "long", day: "numeric", year: "numeric" })}{" "}
                · {event.time}
              </span>
              <span><i className="fa-solid fa-location-dot" /> {event.location}</span>
              <span><i className="fa-solid fa-users" /> {event.registrations_count} registered</span>
            </div>
            <p style={{ color: "var(--pt-text-muted)", whiteSpace: "pre-line" }}>{event.description}</p>
          </div>

          <div
            style={{
              background: "var(--pt-card-bg)",
              border: "1px solid var(--pt-border)",
              borderRadius: "var(--pt-radius-lg)",
              padding: 24,
              boxShadow: "var(--pt-shadow-sm)",
              height: "fit-content",
            }}
          >
            <h2 style={{ fontSize: "1.15rem", marginBottom: 16 }}>Register to Attend</h2>
            <EventRegisterForm slug={event.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
