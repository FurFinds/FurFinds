import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { blogPosts as staticPosts } from "@/lib/data";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return staticPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} — FurFinds Blog`, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), getAllBlogPosts()]);
  if (!post) notFound();

  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="bg-white py-10 lg:py-14">
      <Container className="max-w-3xl">
        <Link href="/blog" className="text-sm font-medium text-dark-blue hover:underline">
          ← Back to Blog
        </Link>

        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-dark-blue/80">
          {post.category}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-black sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-black/50">
          By {post.author}
          {post.date ? ` · ${post.date}` : ""}
        </p>

        <div className="relative mt-8 h-72 w-full overflow-hidden rounded-2xl sm:h-96">
          <Image src={post.image} alt={post.title} fill priority className="object-cover" sizes="768px" />
        </div>

        <div className="mt-8 space-y-5 text-black/80">
          {post.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-medium text-black">Related Posts</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="rounded-xl bg-bg-blue/40 p-4 text-sm font-medium text-dark-blue hover:bg-bg-blue"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
