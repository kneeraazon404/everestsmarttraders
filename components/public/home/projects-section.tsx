import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/public/shared/section-header";
import { ProjectCard } from "@/components/public/shared/project-card";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (!projects.length) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeader
            label="Recent Installations"
            title="Our Work Speaks"
            subtitle="Real projects completed across Nepal — from residential gates to large-scale hotel security systems."
            align="left"
          />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="shrink-0 self-start sm:self-auto"
          >
            <Link href="/showcase#projects">
              All Projects
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
