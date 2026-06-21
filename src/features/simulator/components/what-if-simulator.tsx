"use client";

import { useDeferredValue, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { treesEquivalent, carKmEquivalent } from "@/lib/carbon-engine";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useUserProfile } from "@/stores/user-profile";
import { toast } from "sonner";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";

type ScenarioState = {
  commuteDays: number;
  meatMeals: number;
  homeEfficiency: number;
  flights: number;
  cyclingDays: number;
  renewablePercent: number;
};

const initialState: ScenarioState = {
  commuteDays: 4,
  meatMeals: 6,
  homeEfficiency: 32,
  flights: 3,
  cyclingDays: 0,
  renewablePercent: 10,
};

function estimateMonthlyCarbon(state: ScenarioState) {
  return (
    state.commuteDays * 28 +
    state.meatMeals * 12 +
    (100 - state.homeEfficiency) * 1.3 +
    state.flights * 48 -
    state.cyclingDays * 8 -
    state.renewablePercent * 0.9
  );
}

const controls = [
  { key: "commuteDays", label: "Car commute days / week", min: 0, max: 7, unit: "days" },
  { key: "meatMeals", label: "Higher-impact meals / week", min: 0, max: 14, unit: "meals" },
  { key: "homeEfficiency", label: "Home efficiency score", min: 0, max: 100, unit: "%" },
  { key: "flights", label: "Short flights / quarter", min: 0, max: 8, unit: "flights" },
  { key: "cyclingDays", label: "Cycling/walking days / week", min: 0, max: 7, unit: "days" },
  { key: "renewablePercent", label: "Renewable energy share", min: 0, max: 100, unit: "%" },
];

export function WhatIfSimulator() {
  const [scenario, setScenario] = useState(initialState);
  const deferredScenario = useDeferredValue(scenario);
  
  const profile = useUserProfile((state) => state.profile);
  const onboardingComplete = useUserProfile((state) => state.onboardingComplete);
  const setReductionTargetKg = useUserProfile((state) => state.setReductionTargetKg);

  useEffect(() => {
    if (onboardingComplete && profile) {
      setScenario({
        commuteDays: profile.transport.vehicleType === "none" ? 0 : Math.max(0, 5 - profile.transport.publicTransportDays),
        meatMeals: profile.food.meatMealsPerWeek,
        homeEfficiency: profile.home.applianceUsage === "low" ? 75 : profile.home.applianceUsage === "moderate" ? 50 : 25,
        flights: Math.round((profile.travel.flightsPerYear || 0) / 4),
        cyclingDays: profile.transport.publicTransportDays,
        renewablePercent: 10,
      });
    }
  }, [onboardingComplete, profile]);

  const comparison = useMemo(() => {
    const baselineState = (onboardingComplete && profile) ? {
      commuteDays: profile.transport.vehicleType === "none" ? 0 : Math.max(0, 5 - profile.transport.publicTransportDays),
      meatMeals: profile.food.meatMealsPerWeek,
      homeEfficiency: profile.home.applianceUsage === "low" ? 75 : profile.home.applianceUsage === "moderate" ? 50 : 25,
      flights: Math.round((profile.travel.flightsPerYear || 0) / 4),
      cyclingDays: profile.transport.publicTransportDays,
      renewablePercent: 10,
    } : initialState;

    const baseline = estimateMonthlyCarbon(baselineState);
    const modeled = Math.max(0, estimateMonthlyCarbon(deferredScenario));
    const savings = baseline - modeled;
    const reduction = baseline > 0 ? (savings / baseline) * 100 : 0;
    const financialSavings = Math.round(savings * 12); // ₹12 per kg CO2 saved avg

    return { baseline, modeled, savings, reduction, financialSavings, baselineState };
  }, [deferredScenario, onboardingComplete, profile]);

  const chartData = useMemo(() => {
    const baseState = comparison.baselineState || initialState;
    return [
      { name: "Transport", baseline: baseState.commuteDays * 28, modeled: Math.max(0, scenario.commuteDays * 28 - scenario.cyclingDays * 8) },
      { name: "Food", baseline: baseState.meatMeals * 12, modeled: scenario.meatMeals * 12 },
      { name: "Home", baseline: (100 - baseState.homeEfficiency) * 1.3, modeled: Math.max(0, (100 - scenario.homeEfficiency) * 1.3 - scenario.renewablePercent * 0.9) },
      { name: "Travel", baseline: baseState.flights * 48, modeled: scenario.flights * 48 },
    ];
  }, [comparison, scenario]);

  return (
    <motion.div
      className="grid gap-6 xl:grid-cols-[1.1fr_0.95fr]"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItem}>
        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Scenario Controls
          </p>
          <div className="mt-6 space-y-5">
            {controls.map((control) => (
              <div key={control.key}>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor={`sim-${control.key}`}
                    className="text-sm font-medium text-foreground"
                  >
                    {control.label}
                  </label>
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                    {scenario[control.key as keyof ScenarioState]} {control.unit}
                  </span>
                </div>
                <input
                  id={`sim-${control.key}`}
                  className="range-slider"
                  type="range"
                  min={control.min}
                  max={control.max}
                  value={scenario[control.key as keyof ScenarioState]}
                  onChange={(event) =>
                    setScenario((current) => ({
                      ...current,
                      [control.key]: Number(event.target.value),
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem} className="space-y-6">
        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Carbon impact
          </p>
          <div className="mt-4 rounded-[28px] bg-gradient-to-br from-accent to-accent-strong p-6 text-white">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/80">
              Modeled monthly footprint
            </p>
            <p className="mt-4 text-5xl font-semibold">
              {formatNumber(comparison.modeled)} <span className="text-base">kg CO₂e</span>
            </p>
            <p className="mt-2 text-sm text-white/80">
              {comparison.savings >= 0 ? "Savings" : "Increase"} of{" "}
              {formatNumber(Math.abs(comparison.savings))} kg against your baseline.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/70 bg-white/78 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Baseline</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {formatNumber(comparison.baseline)} kg
              </p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/78 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Reduction</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {formatNumber(comparison.reduction, 1)}%
              </p>
            </div>
          </div>

          {/* Impact equivalencies */}
          <div className="mt-6 grid gap-3 grid-cols-3">
            <div className="rounded-xl bg-accent-soft p-3 text-center">
              <p className="text-lg font-bold text-accent">{treesEquivalent(comparison.savings > 0 ? comparison.savings * 12 : 0)}</p>
              <p className="text-[10px] text-muted">Trees/year</p>
            </div>
            <div className="rounded-xl bg-accent-soft p-3 text-center">
              <p className="text-lg font-bold text-accent">₹{formatNumber(comparison.financialSavings)}</p>
              <p className="text-[10px] text-muted">Annual savings</p>
            </div>
            <div className="rounded-xl bg-accent-soft p-3 text-center">
              <p className="text-lg font-bold text-accent">{formatNumber(carKmEquivalent(comparison.savings > 0 ? comparison.savings : 0))}</p>
              <p className="text-[10px] text-muted">Car km equiv</p>
            </div>
          </div>
          
          <Button
            className="w-full mt-5 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-strong flex items-center justify-center gap-2 h-11"
            onClick={() => {
              setReductionTargetKg(comparison.modeled);
              toast.success(`Simulation target of ${comparison.modeled.toFixed(0)} kg CO₂e saved and applied to your dashboard!`);
            }}
          >
            <Target className="h-4 w-4" />
            Commit Simulation as Target
          </Button>
        </Card>

        {/* Comparison chart */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              Category comparison
            </p>
            <Badge variant="neutral">Live</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid stroke="rgba(16,34,26,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#6c7d74" tickLine={false} axisLine={false} />
                <YAxis stroke="#6c7d74" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="baseline" fill="#8fbca5" radius={[8, 8, 0, 0]} name="Baseline" />
                <Bar dataKey="modeled" fill="#0f9f6f" radius={[8, 8, 0, 0]} name="Modeled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
