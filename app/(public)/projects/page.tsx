import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Everest Smart Traders",
  description: "Projects have moved to our unified showcase page.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/showcase",
  },
};

export default async function ProjectsPage() {
  redirect("/showcase#projects");
}
