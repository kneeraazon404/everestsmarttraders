import { SettingsForm } from "./settings-form";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

async function getSettings() {
  await connection();
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data } = await supabase
    .from("site_settings")
    .select("key, value");

  if (!data) return {};
  return Object.fromEntries(data.map((row) => [row.key, row.value]));
}

export default async function AdminSettingsPage() {
  await connection();
  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
        <p className="text-muted-foreground mt-0.5">
          Manage contact details, business info, and site-wide configuration.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
