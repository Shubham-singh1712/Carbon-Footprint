"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useThemeStore } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const modes = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
  { value: "system" as const, icon: Monitor, label: "System" },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useThemeStore();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-card p-1",
        className,
      )}
      role="radiogroup"
      aria-label="Color theme"
    >
      {modes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          role="radio"
          aria-checked={mode === value}
          aria-label={label}
          onClick={() => setMode(value)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-muted transition-all",
            mode === value
              ? "bg-accent text-white shadow-sm"
              : "hover:text-foreground",
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
