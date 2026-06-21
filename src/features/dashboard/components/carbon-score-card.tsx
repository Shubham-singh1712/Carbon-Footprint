"use client";

import { Card } from "@/components/ui/card";
import { CarbonHealthGauge } from "./carbon-health-gauge";

interface CarbonScoreCardProps {
  score: number;
}

export function CarbonScoreCard({ score }: CarbonScoreCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-6">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted">
        Carbon Health Score
      </p>
      <CarbonHealthGauge score={score} size={160} />
      <p className="mt-3 text-sm leading-6 text-muted">
        {score >= 60
          ? "You're performing above average!"
          : "Room for improvement — check AI Coach."}
      </p>
    </Card>
  );
}
