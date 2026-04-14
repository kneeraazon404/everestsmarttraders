import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pickFallbackImage } from "@/lib/image-fallbacks";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { getProjectBySlug, getAllPublishedProjectSlugs } from "@/lib/supabase/queries";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const canonicalPath = `/projects/${slug}`;

  return {
    title: `${project.title} | Projects | Everest Smart Traders`,
    description:
      project.summary ??
      `${project.title} — a completed installation by Everest Smart Traders.`,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: project.cover_image_url
      ? {
          images: [{ url: project.cover_image_url }],
          url: absoluteUrl(canonicalPath),
        }
      : { url: absoluteUrl(canonicalPath) },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const fallbackCover =
    project.cover_image_url ?? pickFallbackImage(project.slug, 45);
  const allImages = [
    { url: fallbackCover, alt: project.title },
    ...(project.images ?? []).map((img) => ({
      url: img.url,
      alt: img.alt ?? project.title,
    })),
  ];

  return (
    <div className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link
            href="/showcase#projects"
            className="hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            {project.title}
          </span>
        </nav>

        {/* Hero image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted mb-8">
          <Image
            src={allImages[0].url}
            alt={allImages[0].alt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 mb-6">
          {project.industry && (
            <Badge variant="default">{project.industry.name}</Badge>
          )}
          {project.completed_at && <Badge variant="outline">Completed</Badge>}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
          {project.title}
        </h1>

        {/* Info bar */}
        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          {project.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-brand" />
              {project.location}
            </span>
          )}
          {project.industry && (
            <span className="flex items-center gap-1.5">
              <Building2 className="size-4 text-brand" />
              {project.industry.name}
            </span>
          )}
          {project.completed_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4 text-brand" />
              Completed {formatDate(project.completed_at)}
            </span>
          )}
        </div>

        {/* Summary */}
        {project.summary && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {project.summary}
          </p>
        )}

        {/* Challenge / Solution / Result */}
        {(project.challenge || project.solution || project.result) && (
          <div className="space-y-6 mb-10">
            {project.challenge && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  The Challenge
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.challenge}
                </p>
              </div>
            )}
            {project.solution && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Our Solution
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.solution}
                </p>
              </div>
            )}
            {project.result && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  The Result
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.result}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Gallery */}
        {allImages.length > 1 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-foreground mb-5">
              Project Gallery
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allImages.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-4/3 rounded-xl overflow-hidden bg-muted"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-6 bg-brand/5 border border-brand/20 rounded-xl flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <p className="font-semibold text-foreground">
              Want a similar installation?
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Get in touch for a free site assessment and quote.
            </p>
          </div>
          <Button asChild variant="default" size="lg" className="shrink-0">
            <Link href="/quote">Get a Quote</Link>
          </Button>
        </div>

        {/* Back */}
        <div className="mt-8">
          <Link
            href="/showcase#projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            All Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
