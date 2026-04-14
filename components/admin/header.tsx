"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  user: { email: string; name: string | null };
  onMenuClick?: () => void;
}

export function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email.charAt(0).toUpperCase();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3 text-[0.95rem] text-muted-foreground">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="lg:hidden text-muted-foreground hover:text-foreground"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>
        <Link href="/admin" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-brand/15 text-brand text-xs font-semibold">
            {initials}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground leading-tight">
              {user.name ?? user.email}
            </p>
            {user.name && (
              <p className="text-sm text-muted-foreground leading-tight">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
