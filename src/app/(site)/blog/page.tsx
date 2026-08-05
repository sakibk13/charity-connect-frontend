import Link from "next/link";

import { BlogCard } from "@/components/site/blog-card";
import { getBlogPosts } from "@/lib/data";

export const metadata = { title: "News | AICT Global Bangladesh" };

const CATEGORIES = ["Announcements", "Stories", "Impact Reports"];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getBlogPosts({ category });

  return (
    <section className="pt-section">
      <div className="pt-container">
        <h1 className="pt-section-title">News &amp; Blog</h1>
        <p className="pt-section-subtitle">
          Read success stories from the field, look through our audited quarterly reports, and
          explore organizational news.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 40,
            background: "var(--pt-card-bg)",
            border: "1px solid var(--pt-border)",
            padding: "8px 12px",
            borderRadius: "var(--pt-radius-md)",
            maxWidth: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div className="pt-tabs">
            <Link href="/blog" className={`pt-tab-btn${!category ? " active" : ""}`}>
              All
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/blog?category=${encodeURIComponent(c)}`}
                className={`pt-tab-btn${category === c ? " active" : ""}`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <i className="fa-solid fa-folder-open" style={{ fontSize: "3rem", color: "var(--pt-text-light)", marginBottom: 16 }} />
            <h3>No Articles in Category</h3>
            <p style={{ color: "var(--pt-text-muted)", marginTop: 8 }}>
              Check back later for fresh updates and stories.
            </p>
          </div>
        ) : (
          <div className="pt-grid pt-grid-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
