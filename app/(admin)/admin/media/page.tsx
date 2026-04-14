import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { MediaManager } from "./media-manager";

async function getMediaAssets() {
  await connection();
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
  const { data } = await supabase
    .from("media_assets")
    .select("id, filename, url, storage_path, mime_type, size, alt, folder, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  return data ?? [];
}

export default async function MediaPage() {
  await connection();
  const assets = await getMediaAssets();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
        <p className="text-muted-foreground mt-0.5">{assets.length} files uploaded</p>
      </div>
      <MediaManager initialAssets={assets} />
    </div>
  );
}
