"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl mb-4">⚠️</p>
      <h1 className="text-2xl font-bold text-foreground mb-3">Something went wrong</h1>
      <p className="text-muted-foreground max-w-sm mb-8">
        An unexpected error occurred. Please try again or contact us if the problem persists.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={reset} variant="default">
          Try Again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
