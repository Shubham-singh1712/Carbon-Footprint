"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, Flame } from "lucide-react";
import { typedFetch } from "@/lib/api/client";
import { challengesSchema } from "@/features/challenges/schemas";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ChallengesBoard() {
  const challengesQuery = useQuery({
    queryKey: ["challenges-board"],
    queryFn: () =>
      typedFetch("/api/platform/challenges", { method: "GET", cache: "no-store" }, challengesSchema),
  });

  if (!challengesQuery.data) {
    return <Card className="p-6 text-sm text-muted">Loading challenges...</Card>;
  }

  const data = challengesQuery.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-accent text-white">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Current streak
              </p>
              <p className="text-3xl font-semibold text-foreground">{data.streakDays} days</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/80 dark:bg-white/10 text-accent">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Achievements unlocked
              </p>
              <p className="text-3xl font-semibold text-foreground">{data.completed}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Active challenges
          </p>
          <div className="mt-5 space-y-5">
            {data.active.map((challenge) => (
              <div key={challenge.title} className="rounded-[24px] border border-white/70 bg-white/80 dark:border-white/10 dark:bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{challenge.description}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {challenge.reward}
                  </span>
                </div>
                <Progress className="mt-4" value={challenge.progress} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Achievement gallery
          </p>
          <div className="mt-5 space-y-3">
            {data.achievements.map((achievement) => (
              <div
                key={achievement.title}
                className="rounded-[24px] border border-white/70 bg-gradient-to-br from-white to-emerald-50 px-4 py-4 dark:border-white/10 dark:from-white/5 dark:to-emerald-950/20"
              >
                <p className="font-semibold text-foreground">{achievement.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{achievement.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
