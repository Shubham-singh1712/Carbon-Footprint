"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { platformNavigation } from "@/config/navigation";
import { BrandMark } from "@/components/layout/brand-mark";
import { cn } from "@/lib/utils";

export function PlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel-strong sticky top-6 hidden h-[calc(100vh-3rem)] w-80 flex-col p-6 lg:flex overflow-hidden">
      <BrandMark className="mb-8 flex-shrink-0" />
      <nav className="space-y-1.5 flex-1 overflow-y-auto scrollbar-none pb-4" aria-label="Platform navigation">
        {platformNavigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-accent text-white shadow-[0_20px_45px_-30px_rgba(15,159,111,0.9)]"
                  : "text-muted hover:bg-white/70 hover:text-foreground dark:hover:bg-white/5",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 flex-shrink-0 pt-4 border-t border-border/40">
        <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Live Insight
          </p>
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            Your biggest savings are hidden in commute timing and grocery choices.
          </h3>
          <p className="mt-2 text-sm text-muted">
            CarbonTwin AI keeps the product in demo mode until Supabase keys are added.
          </p>
        </div>
      </div>
    </aside>
  );
}
