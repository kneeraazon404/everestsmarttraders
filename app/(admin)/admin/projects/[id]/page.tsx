import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "../project-form";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

interface Props { params: Promise<{ id: string }> }

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  await connection();
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Projects
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-foreground font-medium line-clamp-1">{project.title}</span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
        <Link href={`/projects/${project.slug}`} target="_blank"
          className="text-sm text-brand hover:text-est-amber transition-colors">
          View on site →
        </Link>
      </div>
      <ProjectForm initialData={{
        id: project.id, title: project.title, slug: project.slug,
        summary: project.summary, description: project.description,
        location: project.location, client_name: project.client_name,
        cover_image_url: project.cover_image_url,
        is_published: project.is_published, is_featured: project.is_featured,
        completed_at: project.completed_at,
      }} />
    </div>
  );
}
