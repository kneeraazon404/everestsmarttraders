import { Suspense } from "react";
import { Hero } from "@/components/public/home/hero";
import { TrustStrip } from "@/components/public/home/trust-strip";
import { FeaturedSolutions } from "@/components/public/home/featured-solutions";
import { FeaturedProducts } from "@/components/public/home/featured-products";
import { IndustriesSection } from "@/components/public/home/industries-section";
import { WhyChooseUs } from "@/components/public/home/why-choose-us";
import { ProjectsSection } from "@/components/public/home/projects-section";
import { TestimonialsSection } from "@/components/public/home/testimonials-section";
import { BlogSection } from "@/components/public/home/blog-section";
import { FAQSection } from "@/components/public/home/faq-section";
import { CTABand } from "@/components/public/home/cta-band";
import {
  getSiteSettings,
  getHomepageSections,
  getProductCategories,
  getFeaturedProducts,
  getIndustries,
  getFeaturedProjects,
  getFeaturedTestimonials,
  getFeaturedBlogPosts,
  getFAQs,
} from "@/lib/supabase/queries";

export default async function HomePage() {
  const [
    settings,
    sections,
    categories,
    featuredProducts,
    industries,
    projects,
    testimonials,
    blogPosts,
    faqs,
  ] = await Promise.all([
    getSiteSettings(),
    getHomepageSections(),
    getProductCategories(),
    getFeaturedProducts(8),
    getIndustries(),
    getFeaturedProjects(3),
    getFeaturedTestimonials(6),
    getFeaturedBlogPosts(3),
    getFAQs(),
  ]);

  const sectionMap = Object.fromEntries(
    sections.map((section) => [section.section_key, section])
  );

  return (
    <>
      <Hero settings={settings} section={sectionMap.hero} />
      <TrustStrip />
      <FeaturedSolutions categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <IndustriesSection industries={industries} />
      <WhyChooseUs section={sectionMap.why_us} />
      <ProjectsSection projects={projects} />
      <Suspense fallback={null}>
        <TestimonialsSection testimonials={testimonials} />
      </Suspense>
      <BlogSection posts={blogPosts} />
      <FAQSection faqs={faqs} />
      <CTABand settings={settings} section={sectionMap.cta_band} />
    </>
  );
}
