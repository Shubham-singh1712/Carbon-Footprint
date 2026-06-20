import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="glow-ring flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white">
        <Leaf className="h-5 w-5" />
      </div>
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-lg font-bold tracking-tight text-foreground">CarbonTwin</span>
          <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent uppercase tracking-wider">AI</span>
        </div>
      </div>
    </div>
  );
}
