import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Everest Smart Traders",
  description: "Gallery has moved to our unified showcase page.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/showcase",
  },
};

export default function GalleryPage() {
  redirect("/showcase#gallery");
}
