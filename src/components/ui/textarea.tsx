import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-28 w-full rounded-3xl border border-white/70 bg-white/80 dark:border-white/10 dark:bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-ring",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
