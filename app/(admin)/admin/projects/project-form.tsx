"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createBrowserClient } from "@supabase/ssr";
import { slugify } from "@/lib/utils";

interface ProjectFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    description: string | null;
    location: string | null;
    client_name: string | null;
    cover_image_url: string | null;
    is_published: boolean;
    is_featured: boolean;
    completed_at: string | null;
  };
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!initialData);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManual) setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    const fd = new FormData(e.currentTarget);

    const payload = {
      title: fd.get("title") as string,
      slug: fd.get("slug") as string,
      summary: fd.get("summary") as string || null,
      description: fd.get("description") as string || null,
      location: fd.get("location") as string || null,
      client_name: fd.get("client_name") as string || null,
      cover_image_url: fd.get("cover_image_url") as string || null,
      completed_at: fd.get("completed_at") as string || null,
      is_published: fd.get("is_published") === "on",
      is_featured: fd.get("is_featured") === "on",
    };

    startTransition(async () => {
      if (initialData?.id) {
        await supabase
          .from("projects")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", initialData.id);
      } else {
        const { data } = await supabase
          .from("projects")
          .insert(payload)
          .select("id")
          .single();
        if (data?.id) {
          router.push(`/admin/projects/${data.id}`);
          return;
        }
      }
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 px-4 py-3 rounded-lg">
          <CheckCircle2 className="size-4" />
          Saved successfully.
        </div>
      )}

      <div className="p-5 bg-card border border-border rounded-xl space-y-4">
        <h2 className="font-semibold text-foreground text-sm">Project Details</h2>

        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g., Hotel Gate Automation — Kathmandu"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              defaultValue={initialData?.location ?? ""}
              placeholder="e.g., Thamel, Kathmandu"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client_name">Client Name</Label>
            <Input
              id="client_name"
              name="client_name"
              defaultValue={initialData?.client_name ?? ""}
              placeholder="Hotel name or company (optional)"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="completed_at">Completion Date</Label>
          <Input
            id="completed_at"
            name="completed_at"
            type="date"
            defaultValue={initialData?.completed_at?.split("T")[0] ?? ""}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cover_image_url">Cover Image URL</Label>
          <Input
            id="cover_image_url"
            name="cover_image_url"
            type="url"
            defaultValue={initialData?.cover_image_url ?? ""}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            name="summary"
            defaultValue={initialData?.summary ?? ""}
            placeholder="One-line description shown in project cards"
            rows={2}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Full Description (HTML)</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initialData?.description ?? ""}
            placeholder="<p>Detailed case study...</p>"
            rows={8}
            className="font-mono text-xs"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-5 bg-card border border-border rounded-xl">
          <div>
            <p className="font-medium text-foreground text-sm">Published</p>
            <p className="text-xs text-muted-foreground">Visible on public site</p>
          </div>
          <Switch name="is_published" defaultChecked={initialData?.is_published ?? false} />
        </div>
        <div className="flex items-center justify-between p-5 bg-card border border-border rounded-xl">
          <div>
            <p className="font-medium text-foreground text-sm">Featured</p>
            <p className="text-xs text-muted-foreground">Show on home page</p>
          </div>
          <Switch name="is_featured" defaultChecked={initialData?.is_featured ?? false} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <><Loader2 className="size-4 animate-spin" /> Saving...</>
          ) : (
            initialData ? "Save Changes" : "Create Project"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
