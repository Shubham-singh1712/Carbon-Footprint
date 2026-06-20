"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const projectionData = [
  { month: "Jan", actual: 730, projected: 730, target: 580 },
  { month: "Feb", actual: 690, projected: null, target: 570 },
  { month: "Mar", actual: 655, projected: null, target: 555 },
  { month: "Apr", actual: 618, projected: null, target: 540 },
  { month: "May", actual: 594, projected: null, target: 525 },
  { month: "Jun", actual: 570, projected: null, target: 510 },
  { month: "Jul", actual: null, projected: 548, target: 498 },
  { month: "Aug", actual: null, projected: 520, target: 485 },
  { month: "Sep", actual: null, projected: 494, target: 470 },
  { month: "Oct", actual: null, projected: 472, target: 458 },
  { month: "Nov", actual: null, projected: 456, target: 445 },
  { month: "Dec", actual: null, projected: 438, target: 430 },
];

export function AnnualProjection() {
  const annualActual = projectionData
    .filter((d) => d.actual)
    .reduce((sum, d) => sum + (d.actual ?? 0), 0);
  const annualProjected = projectionData
    .filter((d) => d.projected)
    .reduce((sum, d) => sum + (d.projected ?? 0), 0);
  const totalProjected = annualActual + annualProjected;

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Annual Projection
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">
            {(totalProjected / 1000).toFixed(1)}t CO₂e projected
          </h3>
        </div>
        <Badge variant="neutral">12 months</Badge>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id="actualProjectionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f9f6f" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0f9f6f" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="projectedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(16,34,26,0.08)" vertical={false} />
            <XAxis dataKey="month" stroke="#6c7d74" tickLine={false} axisLine={false} />
            <YAxis stroke="#6c7d74" tickLine={false} axisLine={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#8fbca5"
              strokeWidth={2}
              strokeDasharray="6 4"
              fillOpacity={0}
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#0f9f6f"
              strokeWidth={3}
              fill="url(#actualProjectionFill)"
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="url(#projectedFill)"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-6 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-accent" /> Actual
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-warning" /> Projected
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-6 border-b-2 border-dashed border-muted" /> Target
        </span>
      </div>
    </Card>
  );
}
