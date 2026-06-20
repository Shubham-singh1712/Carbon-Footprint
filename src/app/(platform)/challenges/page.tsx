import { PageHero } from "@/components/shared/page-hero";
import { ChallengesBoard } from "@/features/challenges/components/challenges-board";

export default function ChallengesPage() {
  return (
    <>
      <PageHero
        eyebrow="Challenges & Achievements"
        title="Make low-carbon habits sticky with momentum and recognition."
        description="Run focused challenges, maintain streaks, and unlock achievements that reinforce real progress over time."
      />
      <ChallengesBoard />
    </>
  );
}
