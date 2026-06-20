"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { typedFetch } from "@/lib/api/client";
import { dashboardOverviewSchema } from "@/features/dashboard/schemas";
import { CarbonHealthGauge } from "@/features/dashboard/components/carbon-health-gauge";
import { AnnualProjection } from "@/features/dashboard/components/annual-projection";
import { KpiCard } from "@/components/shared/kpi-card";
import { SkeletonCard } from "@/components/shared/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { staggerContainer, staggerItem } from "@/lib/motion";

import { useUserProfile } from "@/stores/user-profile";

const chartColors = ["#0f9f6f", "#45c48a", "#92ddb1", "#c7f0d6", "#d8efe1"];

export function DashboardOverview() {
  const profile = useUserProfile((state) => state.profile);
  const onboardingComplete = useUserProfile((state) => state.onboardingComplete);

  const overviewQuery = useQuery({
    queryKey: ["platform-overview", onboardingComplete, profile],
    queryFn: () => {
      let url = "/api/platform/overview";
      if (onboardingComplete && profile) {
        const params = new URLSearchParams({
          hasProfile: "true",
          commuteDistanceKm: String(profile.transport.commuteDistanceKm),
          vehicleType: profile.transport.vehicleType,
          publicTransportDays: String(profile.transport.publicTransportDays),
          electricityKwh: String(profile.home.electricityKwh),
          applianceUsage: profile.home.applianceUsage,
          dietType: profile.food.dietType,
          meatMealsPerWeek: String(profile.food.meatMealsPerWeek),
          flightsPerYear: String(profile.travel.flightsPerYear),
          trainTripsPerYear: String(profile.travel.trainTripsPerYear),
          monthlySpend: String(profile.shopping.monthlySpend),
        });
        url += `?${params.toString()}`;
      }
      return typedFetch(url, { method: "GET", cache: "no-store" }, dashboardOverviewSchema);
    },
  });

  const data = overviewQuery.data;

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Carbon Health Score + KPIs */}
      <div className="grid gap-4 xl:grid-cols-4">
        <motion.div variants={staggerItem}>
          <Card className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted">
              Carbon Health Score
            </p>
            <CarbonHealthGauge score={data.healthScore} size={160} />
            <p className="mt-3 text-sm leading-6 text-muted">
              {data.healthScore >= 60
                ? "You're performing above average!"
                : "Room for improvement — check AI Coach."}
            </p>
          </Card>
        </motion.div>
        {data.summary.map((item) => (
          <motion.div key={item.label} variants={staggerItem}>
            <KpiCard {...item} />
          </motion.div>
        ))}
      </div>

      {/* Trend + Breakdown */}
      <motion.div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]" variants={staggerItem}>
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Emission Trend
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">
                On-track toward a 30% yearly reduction
              </h3>
            </div>
            <Badge variant="neutral">AI modeled</Badge>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend}>
                <defs>
                  <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f9f6f" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#0f9f6f" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(16,34,26,0.08)" vertical={false} />
                <XAxis dataKey="period" stroke="#6c7d74" tickLine={false} axisLine={false} />
                <YAxis stroke="#6c7d74" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid rgba(16,34,26,0.09)",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(8px)",
                    fontSize: "13px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#8fbca5"
                  strokeWidth={2}
                  fillOpacity={0}
                  name="Target"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#0f9f6f"
                  strokeWidth={3}
                  fill="url(#actualFill)"
                  name="Actual"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Impact Mix
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">
            Carbon hotspots by category
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.breakdown}
                  dataKey="value"
                  nameKey="category"
                  innerRadius={72}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {data.breakdown.map((entry, index) => (
                    <Cell key={entry.category} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {data.breakdown.map((entry, index) => (
              <div key={entry.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  <span className="text-muted">{entry.category}</span>
                </div>
                <span className="font-semibold text-foreground">{entry.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Annual Projection */}
      <motion.div variants={staggerItem}>
        <AnnualProjection />
      </motion.div>

      {/* Milestones + Coach Brief */}
      <motion.div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]" variants={staggerItem}>
        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Active Milestones
          </p>
          <div className="mt-5 space-y-5">
            {data.milestones.map((milestone) => (
              <div key={milestone.title} className="rounded-[24px] border border-white/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-muted">{milestone.detail}</p>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    {milestone.progress}%
                  </span>
                </div>
                <Progress className="mt-4" value={milestone.progress} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Carbon Coach Brief
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-foreground">
            One recommendation to act on today
          </h3>
          <p className="mt-4 text-base leading-8 text-muted">{data.coachBrief}</p>
          <div className="mt-8 rounded-[24px] bg-accent px-5 py-5 text-white">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/80">
              Projected Savings
            </p>
            <p className="mt-3 text-4xl font-semibold">31 kg CO2e</p>
            <p className="mt-2 text-sm text-white/80">
              Available this month by stacking commute and meal changes.
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
