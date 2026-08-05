import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/lib/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="pt-card" style={{ cursor: "pointer" }}>
      <Link href={`/blog/${post.slug}`} style={{ color: "inherit" }}>
        <div className="pt-card-img-wrapper" style={{ height: 180 }}>
          {post.image_key ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.image_key} alt={post.title} className="pt-card-img" />
          ) : null}
          <span className="pt-card-badge">{post.category}</span>
        </div>
        <div className="pt-card-body" style={{ padding: 20 }}>
          <div style={{ fontSize: "0.8rem", color: "var(--pt-text-light)", marginBottom: 8, fontWeight: 500 }}>
            <i className="fa-solid fa-calendar-days" />{" "}
            {post.published_at ? formatDate(post.published_at, { month: "short", day: "numeric", year: "numeric" }) : ""}
          </div>
          <h3 className="pt-card-title" style={{ fontSize: "1.15rem", lineHeight: 1.3 }}>
            {post.title}
          </h3>
          <p className="pt-card-description" style={{ fontSize: "0.9rem", WebkitLineClamp: 2 }}>
            {post.summary}
          </p>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--pt-primary)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Read Article <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.75rem" }} />
          </span>
        </div>
      </Link>
    </article>
  );
}
