"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { BlogPost } from "@/lib/types";

const categories = [
  "All",
  "Pet-Friendly Travel",
  "Business Spotlights",
  "Pet Care Tips",
  "Industry News",
] as const;

export function BlogClient({ posts: allPosts }: { posts: BlogPost[] }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const activeCategory =
    category && categories.includes(category as (typeof categories)[number]) ? category : "All";

  const posts =
    activeCategory === "All" ? allPosts : allPosts.filter((p) => p.category === activeCategory);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-light-blue text-white"
                : "bg-bg-blue/50 text-dark-blue hover:bg-bg-blue"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-dark-blue/80">
                {post.category}
              </p>
              <h2 className="font-display text-lg font-medium text-black">{post.title}</h2>
              <p className="line-clamp-2 text-sm text-black/70">{post.excerpt}</p>
              <p className="mt-auto pt-2 text-xs text-black/50">
                {post.author} · {post.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
