import Image from "next/image";
import type { Metadata } from "next";
import { SectionHeader } from "@/components/public/shared/section-header";
import { ProductCard } from "@/components/public/shared/product-card";
import { ProjectCard } from "@/components/public/shared/project-card";
import { CTABand } from "@/components/public/home/cta-band";
import {
  getFeaturedProducts,
  getFeaturedProjects,
  getSiteSettings,
} from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Showcase | Everest Smart Traders",
  description:
    "One unified showcase of Everest Smart Traders products, completed projects, and visual gallery inspiration.",
  alternates: {
    canonical: "/showcase",
  },
};

const galleryImages = Array.from({ length: 24 }, (_, index) => {
  const number = String(index + 1).padStart(3, "0");
  return {
    src: `/images/home-automation/home-automation-${number}.jpg`,
    alt: `Automation gallery image ${index + 1}`,
  };
});

export default async function ShowcasePage() {
  const [products, projects, settings] = await Promise.all([
    getFeaturedProducts(12),
    getFeaturedProjects(12),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="bg-muted/40 border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Unified Showcase"
            title="Products, Projects & Gallery"
            subtitle="Everything in one place: explore our solutions, see real installations, and browse visual inspiration."
          />
        </div>
      </section>

      <section
        id="products"
        className="py-12 sm:py-16 bg-background scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Products"
            title="Featured Product Line"
            subtitle="Top automation and security products trusted by residential and commercial clients across Nepal."
            className="mb-10"
            align="left"
          />
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card px-6 py-12 text-center text-muted-foreground">
              Products are being updated. Please check back shortly.
            </div>
          )}
        </div>
      </section>

      <section
        id="projects"
        className="py-12 sm:py-16 bg-muted/30 scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Projects"
            title="Recent Installations"
            subtitle="A snapshot of completed projects showing practical outcomes and quality execution."
            className="mb-10"
            align="left"
          />
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card px-6 py-12 text-center text-muted-foreground">
              Projects are being updated. Please check back shortly.
            </div>
          )}
        </div>
      </section>

      <section
        id="gallery"
        className="py-12 sm:py-16 bg-background scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Gallery"
            title="Automation Inspiration"
            subtitle="A curated visual library to help you imagine the right smart setup for your home or business."
            className="mb-10"
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <figure
                key={image.src}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="relative aspect-4/3">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CTABand settings={settings} />
    </>
  );
}
