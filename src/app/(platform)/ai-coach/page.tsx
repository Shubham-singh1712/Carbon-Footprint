import { PageHero } from "@/components/shared/page-hero";
import { CoachConsole } from "@/features/coach/components/coach-console";

export default function AICoachPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Carbon Coach"
        title="Talk to your footprint like it’s a performance coach."
        description="Ask for plans, trade-offs, and weekly reductions. CarbonTwin AI translates behavior patterns into recommendations you can actually execute."
      />
      <CoachConsole />
    </>
  );
}
