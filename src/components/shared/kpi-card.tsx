import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  suffix,
  delta,
}: {
  label: string;
  value: number;
  suffix: string;
  delta: number;
}) {
  const positive = delta >= 0;

  return (
    <Card className="p-5">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold text-foreground">
            {formatNumber(value, value % 1 === 0 ? 0 : 1)}
            <span className="ml-1 text-sm font-medium text-muted">{suffix}</span>
          </p>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
            positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {Math.abs(delta)}%
        </div>
      </div>
    </Card>
  );
}
