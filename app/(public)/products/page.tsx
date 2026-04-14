import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Everest Smart Traders",
  description: "Products have moved to our unified showcase page.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/showcase",
  },
};

export default async function ProductsPage() {
  redirect("/showcase#products");
}
