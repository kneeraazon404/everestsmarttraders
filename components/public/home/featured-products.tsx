import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/public/shared/section-header";
import { ProductCard } from "@/components/public/shared/product-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeader
            label="Featured Products"
            title="Top-Selling Solutions"
            subtitle="Our most popular automation and security products, trusted by hundreds of clients across Nepal."
            align="left"
          />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="shrink-0 self-start sm:self-auto"
          >
            <Link href="/showcase#products">
              All Products
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
