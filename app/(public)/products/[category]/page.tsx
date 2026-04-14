import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/public/shared/section-header";
import { ProductCard } from "@/components/public/shared/product-card";
import {
  getProductCategories,
  getProductCategoryBySlug,
  getProductsByCategory,
} from "@/lib/supabase/queries";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = await getProductCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getProductCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: `${category.name} | Everest Smart Traders`,
    description:
      category.description ??
      `Browse ${category.name} products from Everest Smart Traders — Nepal's trusted automation specialists.`,
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;

  const [category, products] = await Promise.all([
    getProductCategoryBySlug(slug),
    getProductsByCategory(slug),
  ]);

  if (!category) notFound();

  return (
    <>
      <section className="bg-muted/40 border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={category.name}
            subtitle={category.description ?? undefined}
          />
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">
                No products available in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
