import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-white/70 bg-white/80 dark:border-white/10 dark:bg-white/5 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-ring",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
