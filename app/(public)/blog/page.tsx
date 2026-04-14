import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/public/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { pickFallbackImage } from "@/lib/image-fallbacks";
import { formatDate, readingTime } from "@/lib/utils";
import { getFeaturedBlogPosts } from "@/lib/supabase/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Security & Automation Insights | Everest Smart Traders",
  description:
    "Expert guides, product comparisons, installation tips, and industry news from Nepal's leading automation specialists.",
};

export default async function BlogPage() {
  const posts = await getFeaturedBlogPosts(12);

  return (
    <>
      <section className="bg-muted/40 border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Blog"
            title="Insights & Automation Guides"
            subtitle="Stay informed with the latest in smart security, gate automation, and access control technology."
          />
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl bg-card border border-border hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={
                        post.cover_image_url ?? pickFallbackImage(post.slug, 20)
                      }
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5 p-5 flex-1">
                    {post.category && (
                      <Badge variant="default" className="self-start">
                        {post.category.name}
                      </Badge>
                    )}
                    <h2 className="font-semibold text-foreground leading-snug group-hover:text-brand transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                      {post.published_at && (
                        <span>{formatDate(post.published_at)}</span>
                      )}
                      {post.content && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {readingTime(post.content)} min read
                        </span>
                      )}
                      <span className="ml-auto flex items-center gap-1 text-brand">
                        Read <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              Blog articles coming soon.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
