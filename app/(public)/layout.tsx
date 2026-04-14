import { Suspense } from "react";
import { Header } from "@/components/public/nav/header";
import { Footer } from "@/components/public/footer";
import { WhatsappFab } from "@/components/public/shared/whatsapp-fab";
import { getSiteSettings } from "@/lib/supabase/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header settings={settings} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer settings={settings} />
      <Suspense fallback={null}>
        <WhatsappFab settings={settings} />
      </Suspense>
    </>
  );
}
