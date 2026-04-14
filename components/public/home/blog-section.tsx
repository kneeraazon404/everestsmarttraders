import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, PlayCircle } from "lucide-react";
import { SectionHeader } from "@/components/public/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pickFallbackImage } from "@/lib/image-fallbacks";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  if (!posts.length) return null;

  const [featured, ...rest] = posts;
  const secondary = rest.slice(0, 2);
  const featuredImage =
    featured.cover_image_url ?? pickFallbackImage(featured.slug, 25);
  const featuredHasVideo = Boolean(featured.video_url);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeader
            label="Tutorials"
            title="Step-by-Step Video Guides"
            subtitle="Learn to choose, install, and maintain automation and security systems with our practical video tutorials."
            align="left"
          />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="shrink-0 self-start sm:self-auto"
          >
            <Link href="/tutorials">
              All Tutorials
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Featured tutorial */}
          <Link
            href={`/tutorials/${featured.slug}`}
            className="group lg:col-span-2 relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="relative aspect-video overflow-hidden bg-muted">
              <Image
                src={featuredImage}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {featuredHasVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                    <PlayCircle className="size-9" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 p-6 flex-1">
              {featured.category && (
                <Badge variant="default">{featured.category.name}</Badge>
              )}
              <h3 className="font-bold text-xl text-foreground leading-snug group-hover:text-brand transition-colors line-clamp-2">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                  {featured.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                {featured.published_at && (
                  <span>{formatDate(featured.published_at)}</span>
                )}
                {featured.reading_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {featured.reading_time} min
                  </span>
                )}
                {featuredHasVideo && (
                  <span className="ml-auto flex items-center gap-1 text-brand font-medium">
                    <PlayCircle className="size-3" /> Watch
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Secondary tutorials */}
          <div className="flex flex-col gap-5">
            {secondary.map((post) => {
              const postImage =
                post.cover_image_url ?? pickFallbackImage(post.slug, 30);
              const hasVideo = Boolean(post.video_url);

              return (
                <Link
                  key={post.id}
                  href={`/tutorials/${post.slug}`}
                  className="group flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow"
                >
                  <div className="relative size-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={postImage}
                      alt={post.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    {hasVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="size-5 text-white drop-shadow" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    {post.category && (
                      <span className="text-xs font-semibold text-est-amber uppercase tracking-wide">
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-sm text-foreground leading-snug group-hover:text-brand transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.published_at && (
                      <span className="text-xs text-muted-foreground mt-auto">
                        {formatDate(post.published_at)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* CTA card */}
            <div className="flex flex-col gap-3 p-5 bg-brand/5 border border-brand/20 rounded-xl mt-auto">
              <p className="text-sm font-semibold text-foreground">
                Learn at your own pace with our free video tutorials
              </p>
              <Button asChild variant="default" size="sm">
                <Link href="/tutorials">
                  Explore All Tutorials
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
