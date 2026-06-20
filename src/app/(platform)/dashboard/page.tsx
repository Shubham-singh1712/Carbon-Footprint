import { PageHero } from "@/components/shared/page-hero";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export default function DashboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Mission Control"
        title="A live carbon dashboard that turns awareness into momentum."
        description="Track footprint trends, inspect category hotspots, and act on the reduction milestones CarbonTwin AI is highlighting right now."
      />
      <DashboardOverview />
    </>
  );
}
