"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { typedFetch } from "@/lib/api/client";
import { forecastSchema } from "@/features/forecast/schemas";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { useUserProfile } from "@/stores/user-profile";

export function ForecastAnalytics() {
  const profile = useUserProfile((state) => state.profile);
  const onboardingComplete = useUserProfile((state) => state.onboardingComplete);

  const forecastQuery = useQuery({
    queryKey: ["forecast-analytics", onboardingComplete, profile],
    queryFn: () => {
      let url = "/api/platform/forecast";
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
      return typedFetch(url, { method: "GET", cache: "no-store" }, forecastSchema);
    },
  });

  if (!forecastQuery.data) {
    return <Card className="p-6 text-sm text-muted">Forecasting the next six months...</Card>;
  }

  const data = forecastQuery.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Predictive Horizon
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">
                Baseline vs optimized carbon path
              </h3>
            </div>
            <Badge variant="neutral">6 months</Badge>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.horizon}>
                <defs>
                  <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f9f6f" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#0f9f6f" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(16,34,26,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="#6c7d74" tickLine={false} axisLine={false} />
                <YAxis stroke="#6c7d74" tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  stroke="#9bb7a6"
                  strokeWidth={2}
                  fillOpacity={0}
                />
                <Area
                  type="monotone"
                  dataKey="optimized"
                  stroke="#0f9f6f"
                  strokeWidth={3}
                  fill="url(#optimizedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            AI Signals
          </p>
          <div className="mt-4 space-y-3">
            {data.signals.map((signal) => (
              <div
                key={signal}
                className="rounded-[24px] border border-white/70 bg-white/78 dark:border-white/10 dark:bg-white/5 px-4 py-4 text-sm leading-7 text-muted"
              >
                {signal}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Reduction Opportunities
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-foreground">
          What the model says to prioritize next
        </h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.opportunities}>
              <CartesianGrid stroke="rgba(16,34,26,0.08)" vertical={false} />
              <XAxis dataKey="label" stroke="#6c7d74" tickLine={false} axisLine={false} />
              <YAxis stroke="#6c7d74" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="reduction" fill="#0f9f6f" radius={[14, 14, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
