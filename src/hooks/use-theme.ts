"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "system" as ThemeMode,
      setMode: (mode: ThemeMode) => set({ mode }),
    }),
    { name: "carbontwin-theme" },
  ),
);

/**
 * Resolves the effective theme ("light" | "dark") from the current mode
 * and the system preference.
 */
function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Hook that syncs the `.dark` class on `<html>` with the selected mode.
 * Call this once in a top-level client provider.
 */
export function useThemeSync() {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(mode);
      document.documentElement.classList.toggle("dark", resolved === "dark");
    };

    apply();

    /* Re-apply when the OS preference changes (for "system" mode) */
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mode]);
}
