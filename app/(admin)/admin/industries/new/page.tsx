import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IndustryForm } from "../industry-form";

export default function NewIndustryPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/industries" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Industries
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-foreground font-medium">New Industry</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground">Add Industry</h1>
      <IndustryForm />
    </div>
  );
}
