import { notFound } from "next/navigation";

import { getBlogPost } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  return (
    <article className="pt-section">
      <div className="pt-container" style={{ maxWidth: 700 }}>
        <span className="pt-card-badge" style={{ position: "static", display: "inline-block" }}>
          {post.category}
        </span>

        {post.image_key ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_key}
            alt={post.title}
            style={{
              width: "100%",
              height: 320,
              objectFit: "cover",
              borderRadius: "var(--pt-radius-md)",
              marginTop: 20,
              marginBottom: 20,
              backgroundColor: "var(--pt-border-light)",
            }}
          />
        ) : null}

        <div style={{ fontSize: "0.85rem", color: "var(--pt-text-light)", marginBottom: 12, fontWeight: 500 }}>
          <i className="fa-solid fa-calendar-days" />{" "}
          {post.published_at &&
            `Published on ${formatDate(post.published_at, { month: "long", day: "numeric", year: "numeric" })}`}
        </div>

        <h1 style={{ fontSize: "1.75rem", lineHeight: 1.3, marginBottom: 20 }}>{post.title}</h1>

        {/* content is author-controlled (admin-only endpoint), not user input */}
        <div
          style={{ lineHeight: 1.8, color: "var(--pt-text)", fontSize: "1rem", borderTop: "1px solid var(--pt-border-light)", paddingTop: 20 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
