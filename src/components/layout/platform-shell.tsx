import Link from "next/link";
import { Bell, Sparkles } from "lucide-react";
import { PlatformSidebar } from "@/components/layout/platform-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hasSupabaseConfig } from "@/lib/env";

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const demoMode = !hasSupabaseConfig();

  return (
    <div className="page-shell flex gap-6 py-6">
      <PlatformSidebar />
      <div className="min-w-0 flex-1">
        <div className="glass-panel-strong mb-6 flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              Carbon Operations Center
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                CarbonTwin Intelligence Layer
              </h1>
              {demoMode ? <Badge variant="success">Demo Mode</Badge> : null}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="hidden sm:inline-flex" variant="secondary">
              <Bell className="mr-2 h-4 w-4" aria-hidden="true" />
              Alerts
            </Button>
            <Link href={demoMode ? "/auth/sign-in" : "/dashboard"} className="inline-flex">
              <Button>
                <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                {demoMode ? "Connect account" : "My profile"}
              </Button>
            </Link>
          </div>
        </div>
        <div className="mb-4 flex gap-3 overflow-x-auto pb-2 lg:hidden">
          {[
            "/dashboard",
            "/ai-coach",
            "/receipt-scanner",
            "/simulator",
            "/forecast",
            "/challenges",
            "/impact",
          ].map((href) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-muted dark:border-white/10 dark:bg-white/5"
            >
              {href.replace("/", "").replaceAll("-", " ") || "dashboard"}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
