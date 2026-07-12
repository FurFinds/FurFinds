import { Suspense } from "react";
import { Metadata } from "next";
import { Container } from "@/components/Container";
import { getAllBlogPosts } from "@/lib/blog";
import { BlogClient } from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog — FurFinds",
  description: "Pet-friendly travel tips, business spotlights, pet care advice, and industry news.",
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="bg-white py-10 lg:py-14">
      <Container>
        <h1 className="font-display text-3xl font-light text-black">
          The FurFinds <span className="text-dark-blue">Blog</span>
        </h1>
        <p className="mt-2 max-w-2xl text-black/70">
          Pet-friendly travel, business spotlights, pet care tips, and industry news.
        </p>

        <Suspense fallback={null}>
          <BlogClient posts={posts} />
        </Suspense>
      </Container>
    </div>
  );
}
