"use client";

import { Award, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUserProfile } from "@/stores/user-profile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ChallengesBoard() {
  const streakDays = useUserProfile((state) => state.streakDays);
  const completed = useUserProfile((state) => state.completedChallengesCount);
  const challengesProgress = useUserProfile((state) => state.challengesProgress);
  const achievements = useUserProfile((state) => state.achievementsUnlocked);
  const incrementChallengeProgress = useUserProfile((state) => state.incrementChallengeProgress);

  const activeChallenges = [
    {
      title: "Low-carbon commute week",
      description: "Complete 4 commute windows under 1.5 kg CO2e.",
      reward: "Transit Trailblazer badge",
    },
    {
      title: "Kitchen footprint reset",
      description: "Swap 5 high-impact items for lower-emission alternatives.",
      reward: "Planet Plate streak boost",
    },
    {
      title: "Home efficiency sprint",
      description: "Automate lighting, standby power, and climate timings.",
      reward: "Smart Home Saver badge",
    },
  ];

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
              <p className="text-3xl font-semibold text-foreground">{streakDays} days</p>
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
              <p className="text-3xl font-semibold text-foreground">{completed}</p>
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
            {activeChallenges.map((challenge) => {
              const progress = challengesProgress[challenge.title] ?? 0;
              return (
                <div key={challenge.title} className="rounded-[24px] border border-white/70 bg-white/80 dark:border-white/10 dark:bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted">{challenge.description}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent bg-accent-soft px-2.5 py-1 rounded-full shrink-0">
                      {challenge.reward}
                    </span>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between text-xs text-muted">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        incrementChallengeProgress(challenge.title, 25);
                        if (progress + 25 >= 100) {
                          toast.success(`Challenge completed! You unlocked a new achievement, increased your streak to ${streakDays + 1} days, and earned the ${challenge.reward}!`);
                        } else {
                          toast.success(`Progress logged! ${challenge.title}: ${progress + 25}%`);
                        }
                      }}
                    >
                      Log activity
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Achievement gallery
          </p>
          <div className="mt-5 space-y-3">
            {achievements.map((achievement) => (
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
