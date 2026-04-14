import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TestimonialForm } from "../testimonial-form";

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/testimonials" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Testimonials
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-foreground font-medium">New Testimonial</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground">Add Testimonial</h1>
      <TestimonialForm />
    </div>
  );
}
