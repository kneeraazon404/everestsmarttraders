import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "../blog-form";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/blog"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Tutorials
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-foreground font-medium">New Tutorial</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground">New Tutorial</h1>
      <BlogPostForm />
    </div>
  );
}
