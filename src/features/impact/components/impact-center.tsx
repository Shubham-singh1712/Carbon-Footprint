"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  TreePine,
  Droplets,
  Zap,
  Award,
  Users,
  TrendingDown,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { typedFetch } from "@/lib/api/client";
import { impactSchema } from "@/features/impact/schemas";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/shared/skeleton";
import { staggerContainer, staggerItem } from "@/lib/motion";

const impactCards = [
  { key: "treesEquivalent", icon: TreePine, label: "Trees equivalent saved", suffix: " trees", color: "#22c983" },
  { key: "waterSavedLitres", icon: Droplets, label: "Water footprint saved", suffix: " L", color: "#3b82f6" },
  { key: "energySavedKwh", icon: Zap, label: "Energy equivalent saved", suffix: " kWh", color: "#f59e0b" },
  { key: "totalReductionKg", icon: TrendingDown, label: "Total CO₂ reduced", suffix: " kg", color: "#0f9f6f" },
] as const;

export function ImpactCenter() {
  const impactQuery = useQuery({
    queryKey: ["impact-center"],
    queryFn: () =>
      typedFetch("/api/platform/impact", { method: "GET", cache: "no-store" }, impactSchema),
  });

  if (!impactQuery.data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const data = impactQuery.data;

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Impact KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {impactCards.map((card) => {
          const Icon = card.icon;
          const value = data[card.key as keyof typeof data] as number;
          return (
            <motion.div key={card.key} variants={staggerItem}>
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${card.color}18` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: card.color }} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                      {card.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">
                      {value.toLocaleString()}{card.suffix}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Community + Reduction History */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <motion.div variants={staggerItem}>
          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  Carbon Reduction History
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">
                  Your cumulative impact over time
                </h3>
              </div>
              <Badge variant="neutral">7 months</Badge>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.reductionHistory}>
                  <defs>
                    <linearGradient id="reductionFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f9f6f" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0f9f6f" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(16,34,26,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="#6c7d74" tickLine={false} axisLine={false} />
                  <YAxis stroke="#6c7d74" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="reduction"
                    stroke="#0f9f6f"
                    strokeWidth={3}
                    fill="url(#reductionFill)"
                    name="Reduction (kg CO₂e)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-accent text-white">
                <Users className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  Community ranking
                </p>
                <p className="text-3xl font-semibold text-foreground">
                  #{data.communityRank}
                </p>
                <p className="text-sm text-muted">
                  of {data.totalMembers.toLocaleString()} members
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Top {((data.communityRank / data.totalMembers) * 100).toFixed(0)}%
              </p>
              <div className="mt-2 h-3 w-full rounded-full bg-background-strong">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - (data.communityRank / data.totalMembers) * 100}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Milestones */}
      <motion.div variants={staggerItem}>
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <Award className="h-5 w-5 text-accent" aria-hidden="true" />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              Monthly milestones & achievements
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.milestones.map((milestone) => (
              <div
                key={milestone.title}
                className={`rounded-2xl border p-4 transition ${
                  milestone.achieved
                    ? "border-accent/30 bg-accent-soft"
                    : "border-border bg-card opacity-60"
                }`}
              >
                <div className="flex items-center gap-2">
                  {milestone.achieved ? (
                    <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted" aria-hidden="true" />
                  )}
                  <p className="text-sm font-semibold text-foreground">{milestone.title}</p>
                </div>
                <p className="mt-2 text-xs text-muted">{milestone.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
