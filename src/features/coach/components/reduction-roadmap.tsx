"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownRight, Calendar, ChevronDown, Clock, IndianRupee, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RoadmapStep {
  week: number;
  title: string;
  action: string;
  co2ReductionKg: number;
  costSavings: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  timeRequired: string;
}

const steps: RoadmapStep[] = [
  {
    week: 1,
    title: "Commuting Transition",
    action: "Swap two single-occupant car driving days with public transport.",
    co2ReductionKg: 18,
    costSavings: "₹1,200/month",
    difficulty: "Easy",
    timeRequired: "15 min setup",
  },
  {
    week: 2,
    title: "Plant-Forward Swaps",
    action: "Replace two weekly red-meat dinner meals with seasonal plant-based dishes.",
    co2ReductionKg: 12,
    costSavings: "₹800/month",
    difficulty: "Moderate",
    timeRequired: "30 min prep",
  },
  {
    week: 3,
    title: "Standby Load Cutback",
    action: "Install smart timer plugs on high-frequency home entertainment systems.",
    co2ReductionKg: 8,
    costSavings: "₹400/month",
    difficulty: "Easy",
    timeRequired: "10 min install",
  },
  {
    week: 4,
    title: "Shipment Consolidation",
    action: "Consolidate digital shopping transactions into a single monthly package.",
    co2ReductionKg: 6,
    costSavings: "₹300/month",
    difficulty: "Easy",
    timeRequired: "5 min settings",
  },
];

const difficultyColor: Record<RoadmapStep["difficulty"], string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Challenging: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export function ReductionRoadmap() {
  const [activeWeek, setActiveWeek] = useState<number>(1);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          30-Day AI Reduction Plan
        </p>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-foreground">
        Your carbon reduction roadmap
      </h3>
      <p className="mt-2 text-xs leading-6 text-muted">
        Follow this curated 30-day playbook to compound your monthly lifestyle carbon reductions.
      </p>

      <div className="mt-5 space-y-3">
        {steps.map((step) => {
          const isOpen = activeWeek === step.week;

          return (
            <div
              key={step.week}
              className="rounded-2xl border border-white/70 bg-white/70 transition dark:border-white/10 dark:bg-white/5 overflow-hidden"
            >
              <button
                className="flex w-full items-center justify-between px-4 py-3.5 text-left focus:outline-none"
                onClick={() => setActiveWeek(isOpen ? 0 : step.week)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent font-semibold text-xs">
                    W{step.week}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                      Week {step.week}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="border-t border-border/40 px-4 pb-4 pt-3 space-y-4">
                      <p className="text-xs leading-6 text-muted">{step.action}</p>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-xl bg-accent-soft p-2 text-center">
                          <ArrowDownRight className="mx-auto h-3.5 w-3.5 text-accent" aria-hidden="true" />
                          <p className="mt-1 text-xs font-bold text-accent">-{step.co2ReductionKg} kg</p>
                          <p className="text-[9px] text-muted uppercase tracking-[0.08em]">CO₂ Saved</p>
                        </div>
                        <div className="rounded-xl bg-accent-soft p-2 text-center">
                          <IndianRupee className="mx-auto h-3.5 w-3.5 text-accent" aria-hidden="true" />
                          <p className="mt-1 text-xs font-bold text-accent">{step.costSavings.split("/")[0]}</p>
                          <p className="text-[9px] text-muted uppercase tracking-[0.08em]">Cost cut</p>
                        </div>
                        <div className="rounded-xl bg-accent-soft p-2 text-center">
                          <Clock className="mx-auto h-3.5 w-3.5 text-accent" aria-hidden="true" />
                          <p className="mt-1 text-xs font-bold text-accent">{step.timeRequired.split(" ")[0]}m</p>
                          <p className="text-[9px] text-muted uppercase tracking-[0.08em]">{step.timeRequired.split(" ")[1]}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono uppercase text-muted tracking-wider flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Duration: 7 days
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${difficultyColor[step.difficulty]}`}>
                          {step.difficulty}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
