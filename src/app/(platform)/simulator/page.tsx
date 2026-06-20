import { PageHero } from "@/components/shared/page-hero";
import { WhatIfSimulator } from "@/features/simulator/components/what-if-simulator";

export default function SimulatorPage() {
  return (
    <>
      <PageHero
        eyebrow="What-If Simulator"
        title="Explore carbon outcomes before you make the lifestyle change."
        description="Adjust commuting, diet, travel, and efficiency assumptions to see which behavior shifts move your footprint the fastest."
      />
      <WhatIfSimulator />
    </>
  );
}
