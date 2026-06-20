import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="glow-ring flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white">
        <Leaf className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-[0.28em] text-muted uppercase">
          CarbonTwin
        </p>
        <p className="text-lg font-semibold text-foreground">AI</p>
      </div>
    </div>
  );
}
