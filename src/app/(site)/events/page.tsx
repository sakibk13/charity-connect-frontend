import Link from "next/link";

import { getEvents } from "@/lib/data";
import { splitDateBadge } from "@/lib/format";

export const metadata = { title: "Events | AICT Global Bangladesh" };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <section className="pt-section">
      <div className="pt-container">
        <h1 className="pt-section-title">Community Events</h1>
        <p className="pt-section-subtitle">
          Join our hands-on operations, charity galas, and awareness workshops. Register online
          to book your spot.
        </p>

        {events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <i className="fa-solid fa-calendar-xmark" style={{ fontSize: "3rem", color: "var(--pt-text-light)", marginBottom: 16 }} />
            <h3>No Upcoming Events</h3>
            <p style={{ color: "var(--pt-text-muted)", marginTop: 8 }}>Check back later for new events.</p>
          </div>
        ) : (
          <div className="pt-grid pt-grid-2">
            {events.map((ev) => {
              const { day, month } = splitDateBadge(ev.date);

              return (
                <Link key={ev.id} href={`/events/${ev.slug}`} className="pt-event-card">
                  <div className="pt-event-date-badge">
                    <span className="pt-event-date-day">{day}</span>
                    <span className="pt-event-date-month">{month}</span>
                  </div>
                  <div className="pt-event-content">
                    <h3 className="pt-event-title">{ev.title}</h3>
                    <div className="pt-event-meta">
                      <span><i className="fa-solid fa-clock" /> {ev.time}</span>
                      <span><i className="fa-solid fa-location-dot" /> {ev.location}</span>
                    </div>
                    <p className="pt-event-desc">{ev.description}</p>
                    <div style={{ marginTop: "auto", fontSize: "0.8rem", fontWeight: 600, color: "var(--pt-text-light)" }}>
                      <i className="fa-solid fa-users" /> {ev.registrations_count} Attending
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
