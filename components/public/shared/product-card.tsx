import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pickFallbackImage } from "@/lib/image-fallbacks";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const href = product.category?.slug
    ? `/products/${product.category.slug}/${product.slug}`
    : `/showcase#products`;
  const coverImage =
    product.cover_image_url ?? pickFallbackImage(product.slug, 5);

  return (
    <Card
      className={cn(
        "group overflow-hidden flex flex-col hover:shadow-md transition-shadow",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Image
          src={coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.is_featured && (
          <Badge variant="amber" className="absolute top-3 left-3">
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-col flex-1 gap-3 p-4">
        {product.category && (
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {product.category.name}
          </span>
        )}
        <h3 className="font-semibold text-foreground leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
            {product.short_description}
          </p>
        )}
        {product.price_range && (
          <p className="text-sm font-medium text-primary">
            {product.price_range}
          </p>
        )}
        <div className="flex gap-2 pt-1">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={href}>
              View Details
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
          <Button asChild variant="amber-outline" size="sm">
            <Link href={`/quote?product=${product.id}`}>Quote</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
