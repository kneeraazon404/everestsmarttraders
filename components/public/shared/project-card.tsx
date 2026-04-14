import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { pickFallbackImage } from "@/lib/image-fallbacks";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const coverImage =
    project.cover_image_url ?? pickFallbackImage(project.slug, 15);

  return (
    <Card
      className={cn(
        "group overflow-hidden flex flex-col hover:shadow-md transition-shadow",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {project.industry && (
          <Badge variant="default" className="absolute top-3 left-3">
            {project.industry.name}
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-col gap-2 p-4">
        <h3 className="font-semibold text-foreground leading-snug line-clamp-2">
          {project.title}
        </h3>
        {project.location && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span>{project.location}</span>
          </div>
        )}
        {project.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.summary}
          </p>
        )}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4 mt-1"
        >
          View Installation
          <ArrowRight className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
