import { redirect } from "next/navigation";
import Image from "next/image";
import { LoginForm } from "./login-form";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Everest Smart Traders",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // If already authenticated, redirect to admin
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <div className="min-h-screen bg-brand flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white mb-3">
            <Image
              src="/images/brand-transparent.png"
              alt="Everest Smart Traders logo"
              width={40}
              height={40}
              className="size-10 rounded-xl object-contain bg-white/10 p-1"
              priority
            />
            <span className="font-bold text-xl">Everest Smart Traders</span>
          </div>
          <p className="text-white/60 text-sm">Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-xl font-bold text-foreground mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Access the content management system
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
