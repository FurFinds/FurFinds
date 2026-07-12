import { supabase } from "./supabase";
import { blogPosts as staticPosts } from "./data";
import type { BlogPost } from "./types";

type DbBlogPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: BlogPost["category"];
  author: string;
  published_at: string | null;
};

function mapDbPost(row: DbBlogPost): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content.split(/\n\s*\n/).filter(Boolean),
    category: row.category,
    author: row.author,
    date: row.published_at
      ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
          new Date(row.published_at)
        )
      : "",
    image: row.featured_image || "https://picsum.photos/seed/furfinds-blog-fallback/900/650",
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, content, featured_image, category, author, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const dbPosts = (data ?? []).map(mapDbPost);
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));

  // Keep the curated static posts visible alongside real ones (and as a
  // fallback if Supabase isn't configured yet), skipping any slug that's
  // been superseded by a real HQ-published post of the same slug.
  return [...dbPosts, ...staticPosts.filter((p) => !dbSlugs.has(p.slug))];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const { data } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, content, featured_image, category, author, published_at")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (data) return mapDbPost(data);
  return staticPosts.find((p) => p.slug === slug);
}
