import Link from "next/link";
import Image from "next/image";
import { Clock, PlayCircle, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/public/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { pickFallbackImage } from "@/lib/image-fallbacks";
import { formatDate } from "@/lib/utils";
import { getFeaturedBlogPosts } from "@/lib/supabase/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Tutorials — Security & Automation Video Guides | Everest Smart Traders",
  description:
    "Step-by-step video tutorials on gate automation, hotel locks, smart home, rolling shutters, and access control — from Nepal's leading automation specialists.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/blog",
  },
};

export default async function TutorialsPage() {
  const posts = await getFeaturedBlogPosts(12);

  return (
    <>
      <section className="bg-muted/40 border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Tutorials"
            title="Step-by-Step Video Guides"
            subtitle="Learn to choose, install, and maintain automation and security systems with our practical video tutorials."
          />
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const thumbnail =
                  post.cover_image_url ?? pickFallbackImage(post.slug, 20);
                const hasVideo = Boolean(post.video_url);

                return (
                  <Link
                    key={post.id}
                    href={`/tutorials/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl bg-card border border-border hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <Image
                        src={thumbnail}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {hasVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex size-14 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                            <PlayCircle className="size-8" />
                          </div>
                        </div>
                      )}
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
                        {post.reading_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {post.reading_time} min
                          </span>
                        )}
                        <span className="ml-auto flex items-center gap-1 text-brand font-medium">
                          {hasVideo ? "Watch" : "Read"}{" "}
                          <ArrowRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              Tutorials coming soon.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
