"use client";

import { useState } from "react";
import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

interface AdminShellProps {
  role: string;
  user: { email: string; name: string | null };
  children: React.ReactNode;
}

export function AdminShell({ role, user, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        role={role}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          user={user}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 sm:p-6 overflow-auto text-[15px]"
        >
          <Suspense fallback={null}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
