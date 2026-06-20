import { PageHero } from "@/components/shared/page-hero";
import dynamic from "next/dynamic";

const ImpactCenter = dynamic(
  () =>
    import("@/features/impact/components/impact-center").then(
      (m) => m.ImpactCenter,
    )
);

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact Center"
        title="See the real-world difference your choices are making."
        description="Track your environmental impact through trees saved, water conserved, energy reduced, and your position in the CarbonTwin community."
      />
      <ImpactCenter />
    </>
  );
}
