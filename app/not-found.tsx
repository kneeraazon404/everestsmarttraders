import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand/20 mb-4">404</p>
      <h1 className="text-2xl font-bold text-foreground mb-3">
        Page Not Found
      </h1>
      <p className="text-muted-foreground max-w-sm mb-8">
        We couldn&apos;t find the page you&apos;re looking for. It may have been
        moved or removed.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild variant="default">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">
            <Search className="size-4" />
            Search
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/showcase#products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
