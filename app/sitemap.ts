import type { MetadataRoute } from "next";
import {
  getProductCategories,
  getSitemapProducts,
  getIndustries,
  getSitemapProjects,
  getSitemapBlogPosts,
} from "@/lib/supabase/queries";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://everestsmarttraders.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, industries, projects, blogPosts] =
    await Promise.all([
      getProductCategories(),
      getSitemapProducts(),
      getIndustries(),
      getSitemapProjects(),
      getSitemapBlogPosts(),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/showcase`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${BASE_URL}/industries`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE_URL}/quote`, changeFrequency: "yearly", priority: 0.8 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/products/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((product) => Boolean(product.category?.[0]?.slug))
    .map((product) => ({
      url: `${BASE_URL}/products/${product.category![0].slug}/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const industryRoutes: MetadataRoute.Sitemap = industries.map((i) => ({
    url: `${BASE_URL}/industries/${i.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...industryRoutes,
    ...projectRoutes,
    ...blogRoutes,
  ];
}
